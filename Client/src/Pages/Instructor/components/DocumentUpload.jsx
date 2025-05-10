"use client"
import { FileText, Upload, CheckCircle, AlertCircle } from "lucide-react"
import { Label } from "../../../components/ui/label"

export const DocumentUpload = ({ certificate, governmentId, onCertificateChange, onGovernmentIdChange }) => {
    const handleFileChange = (e, type) => {
        const file = e.target.files[0]
        if (file) {
            if (type === "certificate") {
                onCertificateChange(file)
            } else if (type === "governmentId") {
                onGovernmentIdChange(file)
            }
        }
    }

    const DocumentItem = ({ label, description, file, onChange, type }) => {
        return (
            <div className="border rounded-lg p-4 bg-white">
                <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${file ? "bg-green-100" : "bg-gray-100"}`}>
                        {file ? <CheckCircle className="w-5 h-5 text-green-600" /> : <FileText className="w-5 h-5 text-gray-500" />}
                    </div>
                    <div className="flex-1">
                        <Label className="font-medium">{label}</Label>
                        <p className="text-xs text-gray-500 mb-3">{description}</p>

                        {file ? (
                            <div className="flex items-center gap-2 text-sm">
                                <div className="bg-gray-100 rounded px-3 py-1.5 flex-1 truncate">{file.name}</div>
                                <button
                                    type="button"
                                    onClick={() => onChange(null)}
                                    className="text-red-500 hover:text-red-700 text-xs"
                                >
                                    Remove
                                </button>
                            </div>
                        ) : (
                            <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm py-2 px-4 rounded-md transition-colors inline-flex items-center gap-2">
                                <Upload className="w-4 h-4" />
                                Upload {label}
                                <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    className="hidden"
                                    onChange={(e) => handleFileChange(e, type)}
                                />
                            </label>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div>
                <Label className="text-base font-medium">Verification Documents</Label>
                <p className="text-sm text-gray-500 mb-3">Please upload the required documents for verification</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <DocumentItem
                    label="Certification"
                    description="Upload your diving or relevant adventure certification (PDF, JPG, PNG)"
                    file={certificate}
                    onChange={onCertificateChange}
                    type="certificate"
                />

                <DocumentItem
                    label="Government ID"
                    description="Upload a valid government-issued ID for verification (PDF, JPG, PNG)"
                    file={governmentId}
                    onChange={onGovernmentIdChange}
                    type="governmentId"
                />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <p>
                    Your documents will be securely stored and only used for verification purposes. They will not be shared with
                    third parties.
                </p>
            </div>
        </div>
    )
}
