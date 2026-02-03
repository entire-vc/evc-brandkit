/**
 * @evc/ui
 * Entire VC UI Components
 * 
 * Based on shadcn/ui with EVC brand customizations
 */

// Utilities
export { cn } from './lib/utils';

// Components
export { Button, buttonVariants, type ButtonProps } from './components/button';
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from './components/card';
export { Input, type InputProps } from './components/input';
export { Textarea, type TextareaProps } from './components/textarea';
export { Label, type LabelProps } from './components/label';
export { Badge, badgeVariants, type BadgeProps } from './components/badge';
export { Avatar, AvatarImage, AvatarFallback } from './components/avatar';
export { Separator } from './components/separator';
export { Skeleton } from './components/skeleton';
export { Alert, AlertTitle, AlertDescription } from './components/alert';
export { Switch } from './components/switch';
export { Progress } from './components/progress';
export { Tabs, TabsList, TabsTrigger, TabsContent } from './components/tabs';
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './components/dialog';
export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from './components/select';
export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from './components/tooltip';
export { Checkbox } from './components/checkbox';
export { RadioGroup, RadioGroupItem } from './components/radio-group';
