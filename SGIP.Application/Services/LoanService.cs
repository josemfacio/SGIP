using SGIP.Application.DTOs.Loans;
using SGIP.Application.Services.Interfaces;
using SGIP.Application.Validators;
using SGIP.Domain.Enums;
using SGIP.Application.Repositories.Interfaces;
using SGIP.Domain.Entities;

namespace SGIP.Application.Services;

public class LoanService : ILoanService
{
    private const decimal AnnualEffectiveRate = 0.24m;

    private readonly FinancialCalculator _calculator;
    private readonly LoanValidator _validator;
    private readonly ILoanRepository _loanRepository;
    private readonly ITransactionRepository _transactionRepository;
    private readonly IUserRepository _userRepository;
    public LoanService(
     FinancialCalculator calculator,
     LoanValidator validator,
     ILoanRepository loanRepository,
     ITransactionRepository transactionRepository,
     IUserRepository userRepository)
    {
        _calculator = calculator;
        _validator = validator;
        _loanRepository = loanRepository;
        _transactionRepository = transactionRepository;
        _userRepository = userRepository;
    }

    public LoanSimulationResponse Simulate(
        SimulateLoanRequest request)
    {
        if (!_validator.IsValidAmount(request.Amount))
        {
            throw new ArgumentException(
                "El monto debe estar entre $500 y $50,000."
            );
        }

        if (!_validator.IsValidTerm(request.Term))
        {
            throw new ArgumentException(
                "El plazo debe estar entre 6 y 60 meses."
            );
        }

        if (request.LoanType != LoanType.Fixed)
        {
            throw new NotSupportedException(
                "Por el momento solo se admite el tipo de cuota fija."
            );
        }

        var monthlyRate =
            _calculator.CalculateMonthlyEffectiveRate(
                AnnualEffectiveRate
            );

        var monthlyPayment =
            _calculator.CalculateFixedPayment(
                request.Amount,
                request.Term,
                AnnualEffectiveRate
            );

        var schedule =
            _calculator.GenerateSchedule(
                request.Amount,
                request.Term,
                AnnualEffectiveRate,
                DateTime.UtcNow.Date
            );

        return new LoanSimulationResponse
        {
            Amount = request.Amount,
            Term = request.Term,
            AnnualEffectiveRate = AnnualEffectiveRate,
            MonthlyEffectiveRate = monthlyRate,
            MonthlyPayment = monthlyPayment,

            Schedule = schedule.Select(x =>
                new PaymentScheduleResponse
                {
                    PaymentNumber = x.PaymentNumber,
                    DueDate = x.DueDate,
                    TotalPayment = x.TotalPayment,
                    Principal = x.Principal,
                    Interest = x.Interest,
                    RemainingBalance = x.RemainingBalance
                }
            ).ToList()
        };
    }

    public async Task<LoanResponse> CreateAsync(
    CreateLoanRequest request)
    {
        // =========================================================
        // 1. VALIDACIONES BÁSICAS DE LA SOLICITUD
        // =========================================================

        // El monto permitido está entre $500 y $50,000.
        if (!_validator.IsValidAmount(request.Amount))
        {
            throw new ArgumentException(
                "El monto debe estar entre $500 y $50,000."
            );
        }

        // El plazo permitido está entre 6 y 60 meses.
        if (!_validator.IsValidTerm(request.Term))
        {
            throw new ArgumentException(
                "El plazo debe estar entre 6 y 60 meses."
            );
        }

        // Actualmente el sistema solo soporta préstamos de cuota fija.
        if (request.LoanType != LoanType.Fixed)
        {
            throw new NotSupportedException(
                "Por el momento solo se admite el tipo de cuota fija."
            );
        }


        // =========================================================
        // 2. VALIDAR QUE EL USUARIO EXISTA
        // =========================================================

        var user = await _userRepository.GetByUserIdAsync(
            request.UserId
        );

        if (user is null)
        {
            throw new ArgumentException(
                "El usuario no existe."
            );
        }


        // =========================================================
        // 3. VALIDAR MÁXIMO DE PRÉSTAMOS ACTIVOS
        // =========================================================

        // Obtenemos la cantidad de préstamos activos/aprobados
        // que actualmente tiene el cliente.
        var activeLoanCount =
            await _loanRepository.GetActiveLoanCountAsync(
                request.UserId
            );

        // Regla de negocio:
        // un cliente no puede tener más de 3 préstamos activos.
        if (activeLoanCount >= 3)
        {
            throw new InvalidOperationException(
                "El cliente no puede tener más de 3 préstamos activos."
            );
        }


        // =========================================================
        // 4. CALCULAR LA CUOTA DEL NUEVO PRÉSTAMO
        // =========================================================

        // Calculamos la cuota mensual utilizando:
        // - monto solicitado
        // - plazo
        // - TEA configurada en el sistema
        var monthlyPayment =
            _calculator.CalculateFixedPayment(
                request.Amount,
                request.Term,
                AnnualEffectiveRate
            );


        // =========================================================
        // 5. VALIDAR CAPACIDAD DE PAGO (40%)
        // =========================================================

        // Sumamos las cuotas mensuales de los préstamos
        // que el cliente ya tiene activos.
        var currentMonthlyPayments =
            await _loanRepository.GetActiveMonthlyPaymentSumAsync(
                request.UserId
            );

        // El cliente puede destinar como máximo el 40%
        // de sus ingresos mensuales al pago de préstamos.
        var maximumAllowedPayment =
            user.MonthlyIncome * 0.40m;

        // Sumamos las cuotas actuales + la cuota
        // del nuevo préstamo solicitado.
        var totalMonthlyPayments =
            currentMonthlyPayments + monthlyPayment;

        // Si supera el 40%, rechazamos la solicitud.
        if (totalMonthlyPayments > maximumAllowedPayment)
        {
            throw new InvalidOperationException(
                $"La suma de cuotas ({totalMonthlyPayments:F2}) " +
                $"supera el 40% de los ingresos mensuales " +
                $"permitidos ({maximumAllowedPayment:F2})."
            );
        }


        // =========================================================
        // 6. DETERMINAR SI SE APRUEBA AUTOMÁTICAMENTE
        // =========================================================

        // Regla de aprobación automática:
        // - monto menor a $10,000
        // - menos de 2 préstamos activos
        //
        // La validación del 40% ya se realizó anteriormente.
        var shouldAutoApprove =
            request.Amount < 10000m &&
            activeLoanCount < 2;

        var initialStatus =
            shouldAutoApprove
                ? LoanStatus.Approved
                : LoanStatus.Pending;


        // =========================================================
        // 7. GENERAR EL CRONOGRAMA DE PAGOS
        // =========================================================

        var schedule =
            _calculator.GenerateSchedule(
                request.Amount,
                request.Term,
                AnnualEffectiveRate,
                DateTime.UtcNow.Date
            );


        // =========================================================
        // 8. CREAR LA ENTIDAD LOAN
        // =========================================================

        var loanId = Guid.NewGuid();

        var loan = new Loan
        {
            Id = loanId,
            UserId = request.UserId,
            Amount = request.Amount,
            Term = request.Term,
            InterestRate = AnnualEffectiveRate,
            LoanType = request.LoanType,
            Status = initialStatus,
            MonthlyPayment = monthlyPayment,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            PaymentSchedules = schedule
        };


        // =========================================================
        // 9. RELACIONAR EL CRONOGRAMA CON EL PRÉSTAMO
        // =========================================================

        // Cada cuota pertenece al préstamo recién creado.
        foreach (var item in loan.PaymentSchedules)
        {
            item.LoanId = loanId;
        }


        // =========================================================
        // 10. REGISTRAR EL PRÉSTAMO
        // =========================================================

        await _loanRepository.AddAsync(loan);


        // =========================================================
        // 11. CREAR DESEMBOLSO SI FUE APROBADO AUTOMÁTICAMENTE
        // =========================================================

        if (shouldAutoApprove)
        {
            var transaction = new Transaction
            {
                Id = Guid.NewGuid(),

                // La clave relaciona de forma única el desembolso
                // con este préstamo.
                IdempotencyKey = $"DISBURSEMENT-{loan.Id}",

                Type = TransactionType.Disbursement,
                Amount = loan.Amount,
                Status = TransactionStatus.Completed,
                LoanId = loan.Id,
                Description = "Desembolso por aprobación automática",
                CreatedAt = DateTime.UtcNow
            };

            await _transactionRepository.AddAsync(transaction);
        }


        // =========================================================
        // 12. GUARDAR LOS CAMBIOS EN BASE DE DATOS
        // =========================================================

        // Como los repositorios utilizan el mismo DbContext,
        // SaveChanges persiste el préstamo, cronograma y,
        // cuando corresponde, el desembolso.
        await _loanRepository.SaveChangesAsync();


        // =========================================================
        // 13. DEVOLVER LA RESPUESTA DE LA API
        // =========================================================

        return new LoanResponse
        {
            Id = loan.Id,
            UserId = loan.UserId,
            Amount = loan.Amount,
            Term = loan.Term,
            InterestRate = loan.InterestRate,
            LoanType = loan.LoanType,
            Status = loan.Status,
            MonthlyPayment = loan.MonthlyPayment,
            CreatedAt = loan.CreatedAt
        };
    }

    public async Task<LoanResponse?> GetByIdAsync(Guid id)
    {
        var loan = await _loanRepository.GetByIdAsync(id);

        if (loan is null)
        {
            return null;
        }

        return new LoanResponse
        {
            Id = loan.Id,
            UserId = loan.UserId,
            Amount = loan.Amount,
            Term = loan.Term,
            InterestRate = loan.InterestRate,
            LoanType = loan.LoanType,
            Status = loan.Status,
            MonthlyPayment = loan.MonthlyPayment,
            CreatedAt = loan.CreatedAt
        };
    }
    public async Task<IEnumerable<LoanResponse>> GetAllAsync(
    string? userId = null)
    {
        var loans = await _loanRepository.GetAllAsync(userId);

        return loans.Select(loan =>
            new LoanResponse
            {
                Id = loan.Id,
                UserId = loan.UserId,
                Amount = loan.Amount,
                Term = loan.Term,
                InterestRate = loan.InterestRate,
                LoanType = loan.LoanType,
                Status = loan.Status,
                MonthlyPayment = loan.MonthlyPayment,
                CreatedAt = loan.CreatedAt
            }
        );
    }
    public async Task<IEnumerable<PaymentScheduleResponse>?> GetScheduleAsync(
    Guid loanId)
    {
        var loan = await _loanRepository.GetByIdAsync(loanId);

        if (loan is null)
        {
            return null;
        }

        return loan.PaymentSchedules
            .OrderBy(x => x.PaymentNumber)
            .Select(x =>
                new PaymentScheduleResponse
                {
                    PaymentNumber = x.PaymentNumber,
                    DueDate = x.DueDate,
                    TotalPayment = x.TotalPayment,
                    Principal = x.Principal,
                    Interest = x.Interest,
                    RemainingBalance = x.RemainingBalance
                }
            );
    }

    public async Task<LoanResponse?> ApproveAsync(Guid id)
    {
        var loan = await _loanRepository.GetByIdAsync(id);

        if (loan is null)
        {
            return null;
        }

        if (loan.Status != LoanStatus.Pending)
        {
            throw new InvalidOperationException(
                "Solo se pueden aprobar préstamos en estado Pending."
            );
        }

        loan.Status = LoanStatus.Approved;
        loan.UpdatedAt = DateTime.UtcNow;

        var transaction = new Transaction
        {
            Id = Guid.NewGuid(),
            IdempotencyKey = $"DISBURSEMENT-{loan.Id}",
            Type = TransactionType.Disbursement,
            Amount = loan.Amount,
            Status = TransactionStatus.Completed,
            LoanId = loan.Id,
            Description = "Desembolso de préstamo aprobado",
            CreatedAt = DateTime.UtcNow
        };

        await _transactionRepository.AddAsync(transaction);
        await _loanRepository.SaveChangesAsync();
        return new LoanResponse
        {
            Id = loan.Id,
            UserId = loan.UserId,
            Amount = loan.Amount,
            Term = loan.Term,
            InterestRate = loan.InterestRate,
            LoanType = loan.LoanType,
            Status = loan.Status,
            MonthlyPayment = loan.MonthlyPayment,
            CreatedAt = loan.CreatedAt
        };
    }
    public async Task<LoanResponse?> RejectAsync(Guid id)
    {
        var loan = await _loanRepository.GetByIdAsync(id);

        if (loan is null)
        {
            return null;
        }

        if (loan.Status != LoanStatus.Pending)
        {
            throw new InvalidOperationException(
                "Solo se pueden rechazar préstamos en estado Pending."
            );
        }

        loan.Status = LoanStatus.Rejected;
        loan.UpdatedAt = DateTime.UtcNow;

        await _loanRepository.SaveChangesAsync();

        return new LoanResponse
        {
            Id = loan.Id,
            UserId = loan.UserId,
            Amount = loan.Amount,
            Term = loan.Term,
            InterestRate = loan.InterestRate,
            LoanType = loan.LoanType,
            Status = loan.Status,
            MonthlyPayment = loan.MonthlyPayment,
            CreatedAt = loan.CreatedAt
        };
    }
}