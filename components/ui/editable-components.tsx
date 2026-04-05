"use client";

import { Editable } from "@ark-ui/react/editable";
import { Type, Edit3, Check, X } from "lucide-react";
import { useState } from "react";

export default function TitleEditor({ 
  initialValue = "The Future of Web Development: Trends and Technologies",
  label = "Title",
  description = "Create an engaging title for your content"
}: { 
  initialValue?: string;
  label?: string;
  description?: string;
}) {
 const [value, setValue] = useState(initialValue);
 const maxLength = 100;
 const remainingChars = maxLength - value.length;

 const handleValueChange = (details: { value: string }) => {
 if (details.value.length <= maxLength) {
 setValue(details.value);
 }
 };

 return (
 <div className="w-full max-w-2xl space-y-4">
 <div className="bg-card rounded-lg border border-border p-6">
 <div className="flex items-center space-x-3 mb-6">
 <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
 <Type className="h-5 w-5 text-primary" />
 </div>
 <div>
 <h3 className="text-lg font-semibold text-foreground">
 {label}
 </h3>
 <p className="text-sm text-muted-foreground">
 {description}
 </p>
 </div>
 </div>

 <Editable.Root
 value={value}
 onValueChange={handleValueChange}
 maxLength={maxLength}
 placeholder="Enter your title..."
 autoResize
 >
 <div className="flex items-center justify-between mb-3">
 <Editable.Label className="text-sm font-medium text-foreground">
 {label}
 </Editable.Label>
 <div className="flex items-center space-x-3 text-xs text-muted-foreground">
 <span
 className={
 remainingChars < 10
 ? "text-orange-500"
 : ""
 }
 >
 {remainingChars} characters remaining
 </span>
 <Editable.Context>
 {(editable) => (
 <Editable.Control className="flex items-center space-x-1">
 {editable.editing ? (
 <>
 <Editable.SubmitTrigger className="p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors">
 <Check className="h-3 w-3" />
 </Editable.SubmitTrigger>
 <Editable.CancelTrigger className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors">
 <X className="h-3 w-3" />
 </Editable.CancelTrigger>
 </>
 ) : (
 <Editable.EditTrigger className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors">
 <Edit3 className="h-3 w-3" />
 </Editable.EditTrigger>
 )}
 </Editable.Control>
 )}
 </Editable.Context>
 </div>
 </div>

 <Editable.Area>
 <Editable.Input className="w-full px-4 py-3 text-xl font-bold border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors resize-none min-h-14" />
 <Editable.Preview className="w-full px-4 py-3 text-xl font-bold border border-transparent rounded-lg bg-muted/50 text-foreground hover:border-border cursor-text transition-colors min-h-14 flex items-center" />
 </Editable.Area>

 <div className="mt-4 p-3 bg-muted/50 rounded-lg">
 <h4 className="text-sm font-medium text-foreground mb-2">
 Preview
 </h4>
 <div className="text-lg font-semibold text-muted-foreground leading-relaxed">
 {value || "Your title will appear here..."}
 </div>
 </div>

 <div className="mt-4 text-xs text-muted-foreground">
 💡 Click to edit • Use a compelling title to engage your audience
 </div>
 </Editable.Root>
 </div>
 </div>
 );
}