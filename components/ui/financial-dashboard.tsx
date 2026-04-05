import * as React from 'react';
import { motion } from 'framer-motion';
import {
 ChevronRight,
 History,
 Library,
 Search,
} from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- UTILS ---
function cn(...inputs: any[]) {
 return twMerge(clsx(inputs));
}

// --- TYPE DEFINITIONS ---
type QuickAction = {
 icon: React.ElementType;
 title: string;
 description: string;
};

type Activity = {
 icon: React.ReactNode;
 title: string;
 time: string;
 amount: number;
};

type Service = {
 icon: React.ElementType;
 title: string;
 description: string;
 isPremium?: boolean;
 hasAction?: boolean;
};

interface FinancialDashboardProps {
 quickActions: QuickAction[];
 recentActivity: Activity[];
 financialServices: Service[];
}

// --- HELPER COMPONENTS ---
const IconWrapper = ({
 icon: Icon,
 className,
}: {
 icon: React.ElementType;
 className?: string;
}) => (
 <div
 className={cn(
 'p-2 rounded-full flex items-center justify-center',
 className
 )}
 >
 <Icon className="w-5 h-5" />
 </div>
);

// --- MAIN COMPONENT ---
export const FinancialDashboard: React.FC<FinancialDashboardProps> = ({
 quickActions,
 recentActivity,
 financialServices,
}) => {
 const containerVariants = {
 hidden: { opacity: 0, y: 20 },
 visible: {
 opacity: 1,
 y: 0,
 transition: {
 staggerChildren: 0.1,
 },
 },
 };

 const itemVariants = {
 hidden: { opacity: 0, y: 15 },
 visible: { opacity: 1, y: 0 },
 };

 return (
 <motion.div
 initial="hidden"
 animate="visible"
 variants={containerVariants}
 className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm max-w-4xl mx-auto font-sans p-6"
 >
 {/* Search Bar */}
 <motion.div variants={itemVariants} className="relative mb-6">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
 <input
 type="text"
 placeholder="Search transactions, payments, or type a command..."
 className="bg-background w-full border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background outline-none transition-all"
 />
 <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center justify-center text-xs font-mono text-muted-foreground bg-muted p-1 rounded-md border border-border/50">
 ⌘K
 </kbd>
 </motion.div>

 {/* Quick Actions Grid */}
 <motion.div
 variants={containerVariants}
 className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
 >
 {quickActions.map((action, index) => (
 <motion.div
 key={index}
 variants={itemVariants}
 whileHover={{ scale: 1.05, backgroundColor: 'hsl(var(--muted))' }}
 className="group text-center p-4 rounded-xl cursor-pointer transition-all border border-transparent hover:border-border/50"
 >
 <IconWrapper
 icon={action.icon}
 className="mx-auto mb-3 bg-muted group-hover:bg-background border border-border/50 transition-colors"
 />
 <p className="text-sm font-semibold text-foreground">{action.title}</p>
 <p className="text-xs text-muted-foreground mt-1">
 {action.description}
 </p>
 </motion.div>
 ))}
 </motion.div>

 <div className="grid md:grid-cols-2 gap-8">
 {/* Recent Activity */}
 <motion.div variants={itemVariants}>
 <div className="flex items-center gap-2 mb-4">
 <History className="w-5 h-5 text-primary" />
 <h2 className="text-lg font-bold text-foreground">Recent Activity</h2>
 </div>
 <motion.ul
 variants={containerVariants}
 className="space-y-3"
 >
 {recentActivity.map((activity, index) => (
 <motion.li
 key={index}
 variants={itemVariants}
 className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors"
 >
 <div className="flex items-center gap-3">
 {React.isValidElement(activity.icon) ? (
 activity.icon
 ) : (
 <IconWrapper
 icon={activity.icon as React.ElementType}
 className="bg-muted text-muted-foreground border border-border/50"
 />
 )}
 <div>
 <p className="font-medium text-sm text-foreground">{activity.title}</p>
 <p className="text-xs text-muted-foreground">
 {activity.time}
 </p>
 </div>
 </div>
 <div
 className={cn(
 'text-xs font-bold font-mono py-1 px-2 rounded-full',
 activity.amount > 0
 ? 'text-green-500 dark:text-green-400 bg-green-500/10'
 : 'text-red-500 dark:text-red-400 bg-red-500/10'
 )}
 >
 {activity.amount > 0 ? '+' : '-'}$
 {Math.abs(activity.amount).toFixed(2)}
 </div>
 </motion.li>
 ))}
 </motion.ul>
 </motion.div>

 {/* Financial Services */}
 <motion.div variants={itemVariants}>
 <div className="flex items-center gap-2 mb-4">
 <Library className="w-5 h-5 text-primary" />
 <h2 className="text-lg font-bold text-foreground">Services</h2>
 </div>
 <motion.div
 variants={containerVariants}
 className="space-y-2"
 >
 {financialServices.map((service, index) => (
 <motion.div
 key={index}
 variants={itemVariants}
 whileHover={{
 scale: 1.02,
 backgroundColor: 'hsl(var(--muted))',
 }}
 className="flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border border-transparent hover:border-border/50"
 >
 <div className="flex items-center gap-3">
 <IconWrapper
 icon={service.icon}
 className="bg-muted text-foreground border border-border/50"
 />
 <div>
 <p className="font-medium text-sm text-foreground flex items-center gap-2">
 {service.title}
 {service.isPremium && (
 <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
 Premium
 </span>
 )}
 </p>
 <p className="text-xs text-muted-foreground">
 {service.description}
 </p>
 </div>
 </div>
 {service.hasAction && (
 <ChevronRight className="w-4 h-4 text-muted-foreground" />
 )}
 </motion.div>
 ))}
 </motion.div>
 </motion.div>
 </div>
 </motion.div>
 );
};