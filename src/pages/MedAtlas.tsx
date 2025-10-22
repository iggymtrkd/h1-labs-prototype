import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Upload, Shield, FileText, DollarSign, TrendingUp, CheckCircle2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

// Mock data
const MOCK_ORIGINAL_RECORD = `Patient Name: John Michael Patterson
Date of Birth: March 15, 1982
SSN: 123-45-6789
Phone: (555) 123-4567
Address: 456 Oak Street, Springfield, IL 62701
Insurance ID: BL-987654321

Chief Complaint: Persistent cough and chest discomfort

Diagnosis: Mild hypertension, possible bronchitis
Medications: Lisinopril 10mg daily, Amoxicillin 500mg
Attending Physician: Dr. Sarah Chen, Credential ID: 42`;

const MOCK_DEID_RECORD = `[PATIENT IDENTIFIER REMOVED]
[DATE OF BIRTH REMOVED]
[SOCIAL SECURITY NUMBER REMOVED]
[CONTACT INFORMATION REMOVED]
[ADDRESS REMOVED]
[INSURANCE IDENTIFIER REMOVED]

Chief Complaint: Persistent cough and chest discomfort

Diagnosis: Mild hypertension, possible bronchitis
Medications: Lisinopril 10mg daily, Amoxicillin 500mg
Attending Physician: [PHYSICIAN NAME REMOVED], Credential ID: 42`;

interface UploadedRecord {
  id: string;
  uploadedAt: Date;
  fileName: string;
  status: 'processing' | 'completed' | 'enriching' | 'sold';
  estimatedRevenue: number;
}

export default function MedAtlas() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<UploadedRecord[]>([
    {
      id: 'MED-2025-10-22-001',
      uploadedAt: new Date('2025-10-22'),
      fileName: 'patient_record_001.pdf',
      status: 'completed',
      estimatedRevenue: 2.5
    }
  ]);

  const [selectedRecord, setSelectedRecord] = useState<UploadedRecord | null>(records[0]);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    // Simulate processing
    setTimeout(() => {
      const newRecord: UploadedRecord = {
        id: `MED-${new Date().toISOString().split('T')[0]}-${String(records.length + 1).padStart(3, '0')}`,
        uploadedAt: new Date(),
        fileName: file.name,
        status: 'completed',
        estimatedRevenue: 2.5
      };
      setRecords([...records, newRecord]);
      setSelectedRecord(newRecord);
      setUploading(false);
      toast.success('Record de-identified successfully');
    }, 2000);
  };

  const totalRecords = records.length;
  const enrichedCount = records.filter(r => r.status === 'enriching' || r.status === 'sold').length;
  const totalRevenue = records.filter(r => r.status === 'sold').reduce((sum, r) => sum + r.estimatedRevenue, 0);
  const estimatedRevenue = records.reduce((sum, r) => sum + r.estimatedRevenue, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/prototype')}
            className="mb-4 text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Prototype
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-emerald-500" />
            <h1 className="text-4xl font-bold text-white">MedAtlas</h1>
          </div>
          <p className="text-slate-400">De-identify and monetize medical records</p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Upload & Records */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="p-6 bg-slate-800 border-slate-700">
              <Label className="text-white mb-4 block font-semibold">Upload Medical Records</Label>
              
              <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-emerald-500 transition mb-4">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer block">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                  <p className="text-sm text-slate-400">Click or drag to upload</p>
                  <p className="text-xs text-slate-500 mt-1">PDF, TXT, JSON</p>
                </label>
              </div>

              {uploading && <p className="text-sm text-slate-400 text-center">Processing...</p>}
            </Card>

            {/* Records List */}
            <Card className="p-4 bg-slate-800 border-slate-700 max-h-64 overflow-y-auto">
              <Label className="text-white font-semibold mb-3 block text-sm">Uploaded Records</Label>
              <div className="space-y-2">
                {records.map(record => (
                  <div
                    key={record.id}
                    onClick={() => setSelectedRecord(record)}
                    className={`p-3 rounded-lg cursor-pointer transition ${
                      selectedRecord?.id === record.id
                        ? 'bg-emerald-500/20 border border-emerald-500'
                        : 'bg-slate-700 hover:bg-slate-600 border border-slate-600'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-mono text-emerald-400">{record.id}</p>
                        <p className="text-xs text-slate-400 mt-1">{record.fileName}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          record.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : record.status === 'sold'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }
                      >
                        {record.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Center: De-ID Preview */}
          {selectedRecord && (
            <div className="lg:col-span-1">
              <Card className="p-6 bg-slate-800 border-slate-700 h-full">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-white font-semibold">Record Preview</Label>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> De-Identified
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">{selectedRecord.id}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 mb-2 uppercase">Original (Redacted)</p>
                    <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3 text-xs text-slate-300 max-h-32 overflow-y-auto font-mono whitespace-pre-wrap text-red-300">
                      {MOCK_ORIGINAL_RECORD}
                    </div>
                  </div>

                  <Separator className="bg-slate-700" />

                  <div>
                    <p className="text-xs font-semibold text-slate-400 mb-2 uppercase">De-Identified ✓</p>
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3 text-xs text-slate-300 max-h-32 overflow-y-auto font-mono whitespace-pre-wrap">
                      {MOCK_DEID_RECORD}
                    </div>
                  </div>
                </div>

                <Button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700">
                  <FileText className="w-4 h-4 mr-2" /> Send to Enrichment
                </Button>
              </Card>
            </div>
          )}

          {/* Right: Revenue Dashboard */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="p-6 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
              <div className="flex items-center gap-2 mb-6">
                <DollarSign className="w-6 h-6 text-emerald-500" />
                <h2 className="text-lg font-bold text-white">Revenue Dashboard</h2>
              </div>

              <div className="space-y-4">
                {/* Total Records */}
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="text-sm text-slate-400 mb-1">Records Uploaded</p>
                  <p className="text-3xl font-bold text-white">{totalRecords}</p>
                </div>

                {/* Enriched */}
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="text-sm text-slate-400 mb-1">Enriched Records</p>
                  <p className="text-3xl font-bold text-emerald-400">{enrichedCount}</p>
                </div>

                {/* Realized Revenue */}
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="text-sm text-slate-400 mb-1">Revenue Generated</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-white">{totalRevenue.toFixed(2)}</p>
                    <span className="text-sm text-emerald-400">H1</span>
                  </div>
                </div>

                {/* Estimated Revenue */}
                <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-300">Estimated Revenue</p>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="flex items-baseline gap-2 mt-2">
                    <p className="text-2xl font-bold text-emerald-400">{estimatedRevenue.toFixed(2)}</p>
                    <span className="text-xs text-emerald-400">H1</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Info Card */}
            <Card className="p-4 bg-slate-800 border-slate-700">
              <p className="text-xs text-slate-400 leading-relaxed">
                <span className="text-emerald-400 font-semibold">MedAtlas</span> removes PII from medical records and prepares them for enrichment. Your records will be enriched by clinical professionals on MedTag, and you'll receive revenue share.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
