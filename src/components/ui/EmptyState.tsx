import { Search } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
}

export default function EmptyState({ 
  title = 'No results found', 
  message = 'Try adjusting your search or filters.' 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Search className="w-10 h-10 text-[#E5E3DD] mb-4" />
      <h3 className="text-[#111111] text-lg font-medium mb-2">{title}</h3>
      <p className="text-[#6B6B6B] text-base">{message}</p>
    </div>
  );
}
