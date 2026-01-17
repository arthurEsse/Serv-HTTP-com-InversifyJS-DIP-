import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReportServiceImpl } from './services/ReportServiceImpl.js';
import { InvalidReportSizeError } from './errors/InvalidReportSizeError.js';

// Interfaces para tipar os Mocks
interface MockLogger {
    info: any;
    warn: any;
    error: any;
}

interface MockMailer {
    send: any;
}

// Interface para o Mock do Gerador
interface MockGenerator {
    generate: any;
}

describe('ReportService (Domínio)', () => {
    let mockLogger: MockLogger;
    let mockMailer: MockMailer;
    let mockGenerator: MockGenerator; // Variável para o mock do gerador
    let reportService: ReportServiceImpl;

    beforeEach(() => {
        mockLogger = {
            info: vi.fn(),
            warn: vi.fn(),
            error: vi.fn(),
        };
        mockMailer = {
            send: vi.fn(),
        };
        // Mock do gerador
        mockGenerator = {
            generate: vi.fn().mockReturnValue([
                { nome: "João", cidade: "Cidade A" },
                { nome: "Maria", cidade: "Cidade B" },
                { nome: "Outro", cidade: "Cidade C" },
                { nome: "MaisUm", cidade: "Cidade D" },
                { nome: "Quinto", cidade: "Cidade E" },
            ]),
            };

        // Instancia a classe passando os 3 Mocks
        // Verifique se a ordem dos parâmetros aqui é a mesma do arquivo ReportServiceImpl.ts
        reportService = new ReportServiceImpl(
            mockGenerator as any, //esse tava por ultimo antes um teste passou agora.
            mockLogger as any, 
            mockMailer as any,
        );
    });

    it('Deve lançar InvalidReportSizeError se n for negativo (ex: -5)', async () => {
        let promise = reportService.generateAndSend('teste@email.com', -5);
        await expect(promise)
            .rejects//.rejects porque a função é assíncrona
            .toThrow(InvalidReportSizeError);
        /*Espero que, ao tentar gerar e enviar um relatório com tamanho negativo,
        a função retorne uma promessa que seja rejeitada, e essa rejeição seja um
        erro do tipo InvalidReportSizeError.*/

        expect(mockLogger.warn).toHaveBeenCalled(); 
        // Verifique se a função de aviso (warn) do logger foi realmente invocada.
        // antes tava .error, o que é diferente da classe ReportServiceImpl
        
        /*É comum ter mais de um expect por it. O teste é válido,
        se satifazerem todos os expects */
    });

    it('Deve lançar InvalidReportSizeError se n for maior que 10 (ex: 15)', async () => {
        let promise = reportService.generateAndSend('teste@email.com', 15);
        await expect(promise)
            .rejects//.rejects porque a função é assíncrona
            .toThrow(InvalidReportSizeError);
    });

    it('Deve enviar o e-mail se os dados forem válidos (ex: n=5)', async () => {
        const email = 'sucesso@teste.com';
        
        await reportService.generateAndSend(email, 5);

        // Verifica se o gerador foi chamado
        expect(mockGenerator.generate).toHaveBeenCalledWith(5); // Se n=5, chama 5 vezes

        // Verifica se enviou o e-mail
        expect(mockMailer.send).toHaveBeenCalledWith(email, expect.any(String), expect.any(String));
        
        expect(mockLogger.info).toHaveBeenCalled();
    });
});