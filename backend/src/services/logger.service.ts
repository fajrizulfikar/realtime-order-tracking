import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService extends Logger {
  error(message: string, trace?: string, context?: string): void {
    super.error(message, trace, context || LoggerService.name);
  }

  warn(message: string, context?: string): void {
    super.warn(message, context || LoggerService.name);
  }

  log(message: string, context?: string): void {
    super.log(message, context || LoggerService.name);
  }

  debug(message: string, context?: string): void {
    super.debug(message, context || LoggerService.name);
  }

  verbose(message: string, context?: string): void {
    super.verbose(message, context || LoggerService.name);
  }
}
