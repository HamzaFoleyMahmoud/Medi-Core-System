import { clsx } from 'clsx';

interface ErrorMessageProps {
    title?: string;
    message: string;
    onRetry?: () => void;
    className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
    title = 'Error',
    message,
    onRetry,
    className,
}) => {
    return (
        <div
            className={clsx(
                'bg-danger-50 border border-danger-200 rounded-lg p-4',
                className
            )}
            role="alert"
        >
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <svg
                        className="h-5 w-5 text-danger-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
                <div className="ml-3 flex-1">
                    <h3 className="text-sm font-medium text-danger-800">{title}</h3>
                    <p className="mt-1 text-sm text-danger-700">{message}</p>
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="mt-2 text-sm font-medium text-danger-800 hover:text-danger-900 underline"
                        >
                            Try again
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
