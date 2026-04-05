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
  description?: string;
  hasAction?: boolean;
};

type Activity = {
  icon: React.ElementType;
  title: string;
  time: string;
  amount: number;
};

type FinancialService = {
  icon: React.ElementType;
  title: string;
  description: string;
};

interface FinancialDashboardProps {
  quickActions?: QuickAction[];
  recentActivity?: Activity[];
  financialServices?: FinancialService[];
}

// --- COMPONENTS ---
const IconWrapper = ({ icon: Icon }: { icon: React.ElementType }) => (
  <div className="bg-primary/10 p-2 rounded-full text-primary">
    <Icon className="w-5 h-5" />
  </div>
);

export function FinancialDashboard({
  quickActions = [],
  recentActivity = [],
  financialServices = [],
}: FinancialDashboardProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action, i) => (
          <motion.div
            key={action.title}
            whileHover={{ scale: 1.02 }}
            className="bg-card border border-border p-6 rounded-2xl cursor-pointer hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <IconWrapper icon={action.icon} />
              {action.hasAction && (
                <span className="text-xs font-medium text-green-500">En cours</span>
              )}
            </div>
            <h3 className="font-heading text-lg font-semibold">{action.title}</h3>
            <p className="text-muted-foreground text-sm mt-1">
              {action.description || 'Aucune description'}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-card border border-border p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading text-lg font-semibold">Activité Récente</h3>
            <button className="text-sm text-primary hover:underline">Voir tout</button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-muted/20 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <IconWrapper icon={activity.icon} />
                  <div>
                    <p className="font-medium text-sm">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
                <span
                  className={`font-bold text-sm ${activity.amount >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}
                >
                  {activity.amount >= 0 ? '+' : ''}
                  {activity.amount.toFixed(2)} $
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl">
          <h3 className="font-heading text-lg font-semibold mb-6">
            Services Financiers
          </h3>
          <div className="space-y-4">
            {financialServices.map((service, i) => (
              <div key={i} className="flex items-start gap-3">
                <IconWrapper icon={service.icon} />
                <div>
                  <p className="font-medium text-sm">{service.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}