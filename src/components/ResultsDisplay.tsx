import { CheckCircle, XCircle, AlertTriangle, Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface ProcessingResult {
  decision: 'APPROVED' | 'REJECTED' | 'REVIEW_REQUIRED';
  amount?: number;
  confidence: number;
  justification: {
    primary_clause: string;
    supporting_clauses: string[];
    extracted_entities: Record<string, string>;
  };
  processing_time: string;
}

interface ResultsDisplayProps {
  result: ProcessingResult | null;
}

export const ResultsDisplay = ({ result }: ResultsDisplayProps) => {
  const { toast } = useToast();

  if (!result) {
    return (
      <Card className="p-6 bg-gradient-glass border-border/50 backdrop-blur-sm">
        <div className="text-center text-muted-foreground">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No results to display. Process a query to see the analysis.</p>
        </div>
      </Card>
    );
  }

  const getDecisionIcon = () => {
    switch (result.decision) {
      case 'APPROVED':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'REJECTED':
        return <XCircle className="h-6 w-6 text-red-500" />;
      case 'REVIEW_REQUIRED':
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
    }
  };

  const getDecisionBadge = () => {
    const variants = {
      APPROVED: 'bg-green-500/10 text-green-500 border-green-500/20',
      REJECTED: 'bg-red-500/10 text-red-500 border-red-500/20',
      REVIEW_REQUIRED: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
    };

    return (
      <Badge className={`${variants[result.decision]} font-medium`}>
        {result.decision.replace('_', ' ')}
      </Badge>
    );
  };

  const copyToClipboard = async () => {
    const resultJson = JSON.stringify(result, null, 2);
    await navigator.clipboard.writeText(resultJson);
    toast({
      title: "Copied to clipboard",
      description: "Analysis result has been copied as JSON",
    });
  };

  const downloadResult = () => {
    const resultJson = JSON.stringify(result, null, 2);
    const blob = new Blob([resultJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis-result-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="p-6 bg-gradient-glass border-border/50 backdrop-blur-sm">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getDecisionIcon()}
            <h3 className="text-lg font-semibold">Analysis Results</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="hover:bg-primary/10"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={downloadResult}
              className="hover:bg-primary/10"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Decision Summary */}
        <div className="bg-gradient-secondary rounded-lg p-4 border border-border/30">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold">Decision Summary</h4>
            {getDecisionBadge()}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Decision</p>
              <p className="font-medium">{result.decision.replace('_', ' ')}</p>
            </div>
            {result.amount && (
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="font-medium">₹{result.amount.toLocaleString()}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Confidence</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${result.confidence * 100}%` }}
                  />
                </div>
                <span className="font-medium text-sm">{Math.round(result.confidence * 100)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Justification */}
        <div className="space-y-4">
          <h4 className="font-semibold">Justification</h4>
          
          <div className="bg-gradient-secondary rounded-lg p-4 border border-border/30">
            <h5 className="font-medium text-sm mb-2">Primary Clause</h5>
            <p className="text-sm leading-relaxed bg-primary/5 p-3 rounded border-l-4 border-primary">
              {result.justification.primary_clause}
            </p>
          </div>

          {result.justification.supporting_clauses.length > 0 && (
            <div className="bg-gradient-secondary rounded-lg p-4 border border-border/30">
              <h5 className="font-medium text-sm mb-3">Supporting Clauses</h5>
              <ul className="space-y-2">
                {result.justification.supporting_clauses.map((clause, index) => (
                  <li key={index} className="text-sm leading-relaxed bg-muted/30 p-3 rounded border-l-2 border-muted-foreground/30">
                    {clause}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Extracted Entities */}
          <div className="bg-gradient-secondary rounded-lg p-4 border border-border/30">
            <h5 className="font-medium text-sm mb-3">Extracted Information</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(result.justification.extracted_entities).map(([key, value]) => (
                <div key={key} className="bg-background/50 p-3 rounded border border-border/30">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    {key.replace('_', ' ')}
                  </p>
                  <p className="font-medium">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Processing Time */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Processing completed in {result.processing_time}</span>
          <span>Generated at {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </Card>
  );
};