import { clsx } from 'clsx';

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    title,
    description,
    action,
    className,
}) => {
    return (
        <div
            className={clsx(
                'flex flex-col items-center justify-center py-12 px-4 text-center',
                className
            )}
        >
            {icon && <div className="mb-4 text-gray-400">{icon}</div>}
            <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
            {description && <p className="text-sm text-gray-500 mb-6 max-w-md">{description}</p>}
            {action && (
                <button
                    onClick={action.onClick}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
};
