import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    try {
        const app = await NestFactory.create(AppModule);

        app.enableCors({
            origin: true,
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            credentials: true,
        });

        app.useGlobalPipes(new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
            // Add better error messages for debugging
            exceptionFactory: (errors) => {
                console.log('Validation errors:', JSON.stringify(errors, null, 2));
                const formattedErrors = errors.map(error => ({
                    property: error.property,
                    constraints: error.constraints,
                    value: error.value
                }));
                return new ValidationPipe().createExceptionFactory()(errors);
            }
        }));

        const port = process.env.PORT || 3001;
        await app.listen(port);
        console.log(`Application is running on: http://localhost:${port}`);
    } catch (error) {
        console.error('Error starting application:', error);
        process.exit(1);
    }
}

bootstrap();
