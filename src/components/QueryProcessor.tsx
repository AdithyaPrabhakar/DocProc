import { useState } from 'react';
import { Search, Brain, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface ProcessingStep {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed';
  duration?: number;
}

interface QueryProcessorProps {
  onQueryProcessed: (result: any) => void;
  hasDocuments: boolean;
}

export const QueryProcessor = ({ onQueryProcessed, hasDocuments }: QueryProcessorProps) => {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([]);
  const { toast } = useToast();

  const steps: ProcessingStep[] = [
    { id: '1', name: 'Query Analysis & Parsing', status: 'pending' },
    { id: '2', name: 'Document Semantic Search', status: 'pending' },
    { id: '3', name: 'Clause Extraction & Matching', status: 'pending' },
    { id: '4', name: 'Decision Engine Processing', status: 'pending' },
    { id: '5', name: 'Response Generation', status: 'pending' }
  ];

  const processQuery = async () => {
    if (!query.trim()) {
      toast({
        title: "Error",
        description: "Please enter a query to process",
        variant: "destructive"
      });
      return;
    }

    if (!hasDocuments) {
      toast({
        title: "Error", 
        description: "Please upload documents before processing queries",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProcessingSteps(steps);

    // Simulate processing steps
    for (let i = 0; i < steps.length; i++) {
      setProcessingSteps(prev => 
        prev.map(step => 
          step.id === steps[i].id 
            ? { ...step, status: 'processing' }
            : step
        )
      );

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));

      setProcessingSteps(prev => 
        prev.map(step => 
          step.id === steps[i].id 
            ? { ...step, status: 'completed', duration: Math.round(1000 + Math.random() * 2000) }
            : step
        )
      );
    }

    // Generate mock result based on query
    const mockResult = generateMockResult(query);
    onQueryProcessed(mockResult);
    
    setIsProcessing(false);
    toast({
      title: "Query Processed",
      description: "Analysis complete with decision and justification",
    });
  };

  const generateMockResult = (query: string): any => {
    const lowerQuery = query.toLowerCase();
    
    // Simple keyword-based mock logic
    if (lowerQuery.includes('knee') || lowerQuery.includes('surgery')) {
      return {
        decision: 'APPROVED',
        amount: 150000,
        confidence: 0.94,
        justification: {
          primary_clause: "Section 4.2: Orthopedic surgeries including knee procedures are covered after 3-month waiting period",
          supporting_clauses: [
            "Section 2.1: Policy holder meets minimum age requirement (18-65 years)",
            "Section 3.4: Geographic coverage includes Pune and surrounding areas",
            "Section 5.1: Maximum coverage limit of ₹2,50,000 per annum applies"
          ],
          extracted_entities: {
            age: "46 years",
            gender: "Male", 
            procedure: "Knee Surgery",
            location: "Pune",
            policy_duration: "3 months"
          }
        },
        processing_time: "3.2 seconds"
      };
    } else if (lowerQuery.includes('cardiac') || lowerQuery.includes('heart')) {
      return {
        decision: 'REJECTED',
        amount: 0,
        confidence: 0.87,
        justification: {
          primary_clause: "Section 6.3: Cardiac procedures require 12-month waiting period",
          supporting_clauses: [
            "Section 6.1: Pre-existing cardiac conditions excluded for first year",
            "Current policy duration: 3 months (insufficient for cardiac coverage)"
          ],
          extracted_entities: {
            age: "46 years",
            procedure: "Cardiac procedure",
            policy_duration: "3 months"
          }
        },
        processing_time: "2.8 seconds"
      };
    } else {
      return {
        decision: 'REVIEW_REQUIRED',
        amount: null,
        confidence: 0.65,
        justification: {
          primary_clause: "Insufficient information for automated decision",
          supporting_clauses: [
            "Query requires human review for accurate assessment",
            "Additional documentation may be required"
          ],
          extracted_entities: {
            query_type: "General inquiry"
          }
        },
        processing_time: "1.5 seconds"
      };
    }
  };

  return (
    <Card className="p-6 bg-gradient-glass border-border/50 backdrop-blur-sm">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Query Processor</h3>
        </div>

        <div className="space-y-3">
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your query in natural language...&#10;&#10;Example: '46-year-old male, knee surgery in Pune, 3-month-old insurance policy'"
            className="min-h-[100px] resize-none bg-background/50 border-border/50 focus:border-primary/50"
            disabled={isProcessing}
          />
          
          <Button
            onClick={processQuery}
            disabled={isProcessing || !hasDocuments}
            className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing Query...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Process Query
              </>
            )}
          </Button>
        </div>

        {isProcessing && processingSteps.length > 0 && (
          <div className="space-y-3 mt-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h4 className="font-medium text-sm">Processing Steps</h4>
            </div>
            {processingSteps.map((step) => (
              <div
                key={step.id}
                className="flex items-center gap-3 p-3 bg-gradient-secondary rounded-lg border border-border/30"
              >
                <div className={`
                  h-3 w-3 rounded-full transition-all duration-300
                  ${step.status === 'completed' 
                    ? 'bg-green-500 shadow-lg shadow-green-500/50' 
                    : step.status === 'processing'
                    ? 'bg-primary animate-pulse shadow-lg shadow-primary/50'
                    : 'bg-muted-foreground/30'
                  }
                `} />
                <span className={`
                  text-sm flex-1 transition-colors duration-300
                  ${step.status === 'completed' 
                    ? 'text-foreground font-medium' 
                    : step.status === 'processing'
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground'
                  }
                `}>
                  {step.name}
                </span>
                {step.duration && (
                  <span className="text-xs text-muted-foreground">
                    {step.duration}ms
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};