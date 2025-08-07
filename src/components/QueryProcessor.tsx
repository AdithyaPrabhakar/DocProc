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
    const extractedEntities = extractEntitiesFromQuery(query);
    const processingTime = (2.1 + Math.random() * 2.5).toFixed(1);
    
    // Analyze based on realistic document content (Well Baby Well Mother Add-On)
    const coverageAnalysis = analyzeQueryAgainstPolicy(lowerQuery, extractedEntities);
    
    return {
      decision: coverageAnalysis.decision,
      amount: coverageAnalysis.amount,
      confidence: coverageAnalysis.confidence,
      justification: {
        primary_clause: coverageAnalysis.primary_clause,
        supporting_clauses: coverageAnalysis.supporting_clauses,
        extracted_entities: extractedEntities
      },
      processing_time: `${processingTime} seconds`
    };
  };

  const analyzeQueryAgainstPolicy = (query: string, entities: any) => {
    // Based on typical Well Baby Well Mother Add-On policy content
    const age = entities.age ? parseInt(entities.age) : null;
    
    // Check if query relates to covered scenarios
    const isNewbornCare = query.includes('newborn') || query.includes('baby') || 
                         query.includes('infant') || (age !== null && age <= 1);
    const isMaternalCare = query.includes('mother') || query.includes('maternal') || 
                          query.includes('pregnancy') || query.includes('delivery');
    const isAirAmbulance = query.includes('air ambulance') || query.includes('emergency transport');
    
    // Check for non-covered scenarios
    const isChildOver1 = age !== null && age > 1 && age < 18;
    const isAdult = age !== null && age >= 18;
    const isCardiac = query.includes('heart') || query.includes('cardiac');
    const isDeath = query.includes('died') || query.includes('death') || query.includes('mortality');
    
    if (isNewbornCare && !isDeath) {
      return {
        decision: 'APPROVED',
        amount: 50000,
        confidence: 0.90,
        primary_clause: "Well Baby coverage applies to newborns up to 30 days post-delivery",
        supporting_clauses: [
          "Coverage includes immediate newborn care expenses",
          "Policy holder has valid maternal coverage"
        ]
      };
    }
    
    if (isMaternalCare && !isDeath) {
      return {
        decision: 'APPROVED', 
        amount: 75000,
        confidence: 0.85,
        primary_clause: "Well Mother coverage applies during pregnancy and delivery",
        supporting_clauses: [
          "Coverage includes prenatal and postnatal care",
          "Delivery expenses covered under maternal benefits"
        ]
      };
    }
    
    if (isAirAmbulance) {
      return {
        decision: 'REVIEW_REQUIRED',
        amount: null,
        confidence: 0.70,
        primary_clause: "Air ambulance coverage subject to emergency conditions and pre-approval",
        supporting_clauses: [
          "Must meet emergency criteria as defined in policy",
          "Prior authorization may be required"
        ]
      };
    }
    
    if (isChildOver1 || isAdult) {
      return {
        decision: 'REJECTED',
        amount: 0,
        confidence: 0.95,
        primary_clause: "This add-on policy only covers newborns (up to 30 days) and maternal care",
        supporting_clauses: [
          `Age ${entities.age || 'specified'} falls outside coverage scope`,
          "No coverage for individuals beyond newborn period"
        ]
      };
    }
    
    if (isDeath || isCardiac) {
      return {
        decision: 'REJECTED',
        amount: 0,
        confidence: 0.95,
        primary_clause: "Well Baby Well Mother Add-On does not cover mortality or cardiac events",
        supporting_clauses: [
          "Policy scope limited to routine maternal and newborn care",
          "Life insurance benefits not included in this add-on"
        ]
      };
    }
    
    return {
      decision: 'REVIEW_REQUIRED',
      amount: null,
      confidence: 0.60,
      primary_clause: "Query does not clearly match Well Baby Well Mother Add-On coverage scope",
      supporting_clauses: [
        "Manual review required to determine coverage eligibility",
        "Additional documentation may be needed"
      ]
    };
  };

  const extractEntitiesFromQuery = (query: string) => {
    const entities: any = {};
    let completeness = 0;
    
    // Age extraction
    const ageMatch = query.match(/(\d+)[-\s]?(year|yr|y\.o\.|yo|years old|m|male|f|female)/i);
    if (ageMatch) {
      entities.age = `${ageMatch[1]} years`;
      completeness += 0.2;
    }
    
    // Gender extraction
    const genderMatch = query.match(/\b(male|female|man|woman|m|f)\b/i);
    if (genderMatch) {
      entities.gender = genderMatch[1].toLowerCase().startsWith('m') ? 'Male' : 'Female';
      completeness += 0.15;
    }
    
    // Location extraction
    const locationMatch = query.match(/\b(mumbai|delhi|bangalore|pune|chennai|kolkata|hyderabad|ahmedabad|[A-Z][a-z]+)\b/i);
    if (locationMatch) {
      entities.location = locationMatch[1];
      completeness += 0.2;
    }
    
    // Procedure extraction
    const procedures = ['knee surgery', 'cardiac', 'heart surgery', 'appendectomy', 'cataract', 'dental', 'orthopedic', 'surgery'];
    const procedureMatch = procedures.find(proc => query.toLowerCase().includes(proc));
    if (procedureMatch) {
      entities.procedure = procedureMatch.charAt(0).toUpperCase() + procedureMatch.slice(1);
      completeness += 0.25;
    }
    
    // Policy duration extraction
    const durationMatch = query.match(/(\d+)[-\s]?(month|months|year|years|day|days)[-\s]?(old|policy)/i);
    if (durationMatch) {
      entities.policy_duration = `${durationMatch[1]} ${durationMatch[2]}`;
      completeness += 0.2;
    }
    
    entities.completeness = Math.min(1.0, completeness);
    return entities;
  };

  const determineProcedureType = (query: string) => {
    if (query.includes('knee') || query.includes('orthopedic')) {
      return {
        covered: true,
        waiting_period: '3 months',
        coverage_amount: 150000 + Math.floor(Math.random() * 50000),
        primary_clause: "Section 4.2: Orthopedic surgeries including knee procedures covered after 3-month waiting period",
        secondary_clause: "Section 4.3: Orthopedic coverage includes joint replacements and repairs"
      };
    } else if (query.includes('cardiac') || query.includes('heart')) {
      return {
        covered: true,
        waiting_period: '12 months',
        coverage_amount: 300000 + Math.floor(Math.random() * 100000),
        primary_clause: "Section 6.1: Cardiac procedures covered after 12-month waiting period",
        secondary_clause: "Section 6.2: Pre-existing cardiac conditions excluded for first year"
      };
    } else if (query.includes('dental')) {
      return {
        covered: false,
        waiting_period: null,
        coverage_amount: 0,
        exclusion_clause: "Section 8.3: Dental procedures excluded from coverage",
        secondary_clause: "Section 8.4: Cosmetic dental work not covered"
      };
    } else if (query.includes('cataract') || query.includes('eye')) {
      return {
        covered: true,
        waiting_period: '6 months',
        coverage_amount: 75000 + Math.floor(Math.random() * 25000),
        primary_clause: "Section 5.1: Eye surgeries including cataract covered after 6-month waiting period"
      };
    } else {
      return {
        covered: null,
        waiting_period: null,
        coverage_amount: 0
      };
    }
  };

  const checkWaitingPeriod = (requiredPeriod: string | null, policyDuration: string) => {
    if (!requiredPeriod || !policyDuration) {
      return { compliant: false, clause: "Waiting period verification inconclusive" };
    }
    
    const parseMonths = (duration: string): number => {
      const monthMatch = duration.match(/(\d+)\s*months?/i);
      const yearMatch = duration.match(/(\d+)\s*years?/i);
      
      if (monthMatch) return parseInt(monthMatch[1]);
      if (yearMatch) return parseInt(yearMatch[1]) * 12;
      return 0;
    };
    
    const requiredMonths = parseMonths(requiredPeriod);
    const policyMonths = parseMonths(policyDuration);
    
    if (policyMonths >= requiredMonths) {
      return {
        compliant: true,
        clause: `Waiting period requirement met: ${policyDuration} policy duration ≥ ${requiredPeriod} required`
      };
    } else {
      return {
        compliant: false,
        clause: `Waiting period not met: ${policyDuration} policy < ${requiredPeriod} required`,
        rejection_clause: `Section 9.1: ${requiredPeriod} waiting period required - current policy duration ${policyDuration} insufficient`
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