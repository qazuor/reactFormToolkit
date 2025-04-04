// Import and re-export defaultStyles directly to avoid circular dependencies
import { defaultStyles } from './styles';

export * from '@/lib/form';
export * from '@/lib/utils';
export * from '@/lib/i18n';
export * from '@/lib/styles';
export * from '@/lib/ui-library';

// Re-export defaultStyles directly
export { defaultStyles };
