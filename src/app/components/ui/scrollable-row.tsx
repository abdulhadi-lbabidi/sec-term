import { useRef, MouseEvent as ReactMouseEvent } from 'react';
import { cn } from '@/lib/utils';

export function useDraggableScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e: ReactMouseEvent) => {
    if (!ref.current) return;
    isDown.current = true;
    ref.current.classList.add('cursor-grabbing');
    startX.current = e.pageX - ref.current.offsetLeft;
    scrollLeft.current = ref.current.scrollLeft;
  };

  const onMouseLeave = () => {
    isDown.current = false;
    if (ref.current) ref.current.classList.remove('cursor-grabbing');
  };

  const onMouseUp = () => {
    isDown.current = false;
    if (ref.current) ref.current.classList.remove('cursor-grabbing');
  };

  const onMouseMove = (e: ReactMouseEvent) => {
    if (!isDown.current || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    ref.current.scrollLeft = scrollLeft.current - walk;
  };

  return {
    ref,
    onMouseDown,
    onMouseLeave,
    onMouseUp,
    onMouseMove,
  };
}

export function ScrollableRow({ children, className }: { children: React.ReactNode, className?: string }) {
  const scrollProps = useDraggableScroll<HTMLDivElement>();
  return (
    <div 
      {...scrollProps}
      className={cn("flex overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing", className)}
    >
      {children}
    </div>
  );
}
