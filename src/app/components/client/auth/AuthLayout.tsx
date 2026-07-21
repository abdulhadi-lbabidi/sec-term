import React from 'react';
import { cn } from '@/lib/utils';

export const AuthLayout = ({ 
  children, 
  title, 
  subtitle, 
  image, 
  reverse = false 
}: { 
  children: React.ReactNode, 
  title: string, 
  subtitle: string, 
  image: string,
  reverse?: boolean
}) => {
  return (
    <div className="min-h-[85vh] w-full flex items-center justify-center py-10 px-4 md:px-8">
      <div className={cn(
        "w-full max-w-[1200px] bg-white rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col border border-border/50",
        reverse ? "md:flex-row-reverse" : "md:flex-row"
      )}>
        
        
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white relative z-10">
          <div className="max-w-md w-full mx-auto">
            {children}
          </div>
        </div>

    
        <div className="hidden md:block w-1/2 relative bg-primary/5">
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-[20s] hover:scale-110"
            style={{ backgroundImage: `url('${image}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 z-0"></div>
          
          <div className="absolute bottom-12 start-12 end-12 z-10 text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 drop-shadow-md leading-tight">{title}</h2>
            <p className="text-lg text-white/90 font-light drop-shadow leading-relaxed">{subtitle}</p>
          </div>
        </div>

      </div>
    </div>
  );
};
