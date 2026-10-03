import Button from './Button';

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white rounded-[2rem] border border-gray-100 shadow-sm max-w-2xl mx-auto">
      {Icon && (
        <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center mb-6">
          <Icon size={32} />
        </div>
      )}
      <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">{title}</h3>
      <p className="text-base text-gray-500 max-w-md mb-8">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="lg" className="shadow-sm">{actionLabel}</Button>
      )}
    </div>
  );
}
