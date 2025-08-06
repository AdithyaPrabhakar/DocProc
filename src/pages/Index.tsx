import { useState } from 'react';
import { Brain, FileText, Search, Sparkles } from 'lucide-react';
import { DocumentUpload } from '@/components/DocumentUpload';
import { QueryProcessor } from '@/components/QueryProcessor';
import { ResultsDisplay } from '@/components/ResultsDisplay';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'processed' | 'error';
}

const Index = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [processingResult, setProcessingResult] = useState<any>(null);

  const handleFilesProcessed = (files: UploadedFile[]) => {
    setUploadedFiles(files);
  };

  const handleQueryProcessed = (result: any) => {
    setProcessingResult(result);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-primary text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Brain className="h-12 w-12 text-white drop-shadow-lg" />
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                LLM Document Processing
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Advanced natural language processing for intelligent document analysis, 
              clause extraction, and automated decision making
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <FileText className="h-6 w-6 text-white/90" />
                <span className="text-white/90 font-medium">Multi-format Support</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <Search className="h-6 w-6 text-white/90" />
                <span className="text-white/90 font-medium">Semantic Search</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <Sparkles className="h-6 w-6 text-white/90" />
                <span className="text-white/90 font-medium">Intelligent Decisions</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Upload & Query */}
          <div className="lg:col-span-1 space-y-8">
            <DocumentUpload onFilesProcessed={handleFilesProcessed} />
            <QueryProcessor 
              onQueryProcessed={handleQueryProcessed}
              hasDocuments={uploadedFiles.some(f => f.status === 'processed')}
            />
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-2">
            <ResultsDisplay result={processingResult} />
          </div>
        </div>

        {/* Sample Query Section */}
        <div className="mt-16 bg-gradient-secondary rounded-xl p-8 border border-border/50">
          <h2 className="text-2xl font-bold mb-6 text-center">Sample Queries</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-background/50 rounded-lg p-4 border border-border/30">
              <h3 className="font-semibold mb-2 text-primary">Insurance Claim</h3>
              <p className="text-sm text-muted-foreground italic">
                "46-year-old male, knee surgery in Pune, 3-month-old insurance policy"
              </p>
            </div>
            <div className="bg-background/50 rounded-lg p-4 border border-border/30">
              <h3 className="font-semibold mb-2 text-primary">Contract Analysis</h3>
              <p className="text-sm text-muted-foreground italic">
                "Early termination clause for software licensing agreement, 6-month notice period"
              </p>
            </div>
            <div className="bg-background/50 rounded-lg p-4 border border-border/30">
              <h3 className="font-semibold mb-2 text-primary">HR Policy</h3>
              <p className="text-sm text-muted-foreground italic">
                "Remote work eligibility for senior developers with 2+ years experience"
              </p>
            </div>
            <div className="bg-background/50 rounded-lg p-4 border border-border/30">
              <h3 className="font-semibold mb-2 text-primary">Legal Compliance</h3>
              <p className="text-sm text-muted-foreground italic">
                "Data retention requirements for financial records in European markets"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;