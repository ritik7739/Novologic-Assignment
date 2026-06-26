import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';
import { cn } from '@/lib/utils/cn';

type ToolbarButtonProps = {
  label: string;
  icon: LucideIcon;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
};

export function ToolbarButton({ label, icon: Icon, active, disabled, onClick }: ToolbarButtonProps) {
  return (
    <Tooltip label={label}>
      <Button
        size="icon"
        variant="ghost"
        disabled={disabled}
        onClick={onClick}
        aria-label={label}
        className={cn('rounded-md shadow-none', active && 'bg-teal-100 text-teal-800 hover:bg-teal-100 dark:bg-teal-950/70 dark:text-teal-200')}
      >
        <Icon className="size-4" />
      </Button>
    </Tooltip>
  );
}
