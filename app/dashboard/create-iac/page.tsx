'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/lib/auth-context';

interface IaCFormData {
  provider: string;
  resource: string;
  variable: string;
  output: string;
  module: string;
  state: string;
  locals: string;
  backend: string;
  variableType: string;
  dynamic: string;
  forEach: string;
  terraform: string;
  tags: string;
  lifecycle: string;
  provisioner: string;
  [key: string]: string;
}

export default function CreateIaCFile() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState<IaCFormData>({
    provider: '',
    resource: '',
    variable: '',
    output: '',
    module: '',
    state: '',
    locals: '',
    backend: '',
    variableType: '',
    dynamic: '',
    forEach: '',
    terraform: '',
    tags: '',
    lifecycle: '',
    provisioner: '',
  });

  const [generatedCode, setGeneratedCode] = useState(`# Generated IaC Configuration
# Your configuration will appear here
`);

  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/sign-in');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const fields = [
    { key: 'provider', label: 'Provider' },
    { key: 'resource', label: 'Resource' },
    { key: 'variable', label: 'Variable' },
    { key: 'output', label: 'Output' },
    { key: 'module', label: 'Module' },
    { key: 'state', label: 'State' },
    { key: 'locals', label: 'Locals' },
    { key: 'backend', label: 'Backend' },
    { key: 'variableType', label: 'Variable Type' },
    { key: 'dynamic', label: 'Dynamic' },
    { key: 'forEach', label: 'For Each' },
    { key: 'terraform', label: 'Terraform' },
    { key: 'tags', label: 'Tags' },
    { key: 'lifecycle', label: 'Lifecycle' },
    { key: 'provisioner', label: 'Provisioner' },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    generateCode({ ...formData, [name]: value });
  };

  const handleFieldToggle = (fieldKey: string) => {
    setSelectedFields(prev =>
      prev.includes(fieldKey)
        ? prev.filter(f => f !== fieldKey)
        : [...prev, fieldKey]
    );
  };

  const generateCode = (data: IaCFormData) => {
    let code = `# Terraform Configuration\n\n`;

    if (data.provider) {
      code += `terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "${data.provider}"
}\n\n`;
    }

    if (data.resource) {
      code += `resource "aws_instance" "example" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
}\n\n`;
    }

    if (data.variable) {
      code += `variable "environment" {
  type        = string
  description = "${data.variable}"
  default     = "dev"
}\n\n`;
    }

    if (data.output) {
      code += `output "instance_id" {
  value       = aws_instance.example.id
  description = "${data.output}"
}\n\n`;
    }

    if (data.module) {
      code += `module "vpc" {
  source = "./modules/vpc"
  
  name = "${data.module}"
}\n\n`;
    }

    if (data.tags) {
      code += `locals {
  tags = {
    Environment = "dev"
    Project     = "${data.tags}"
  }
}\n\n`;
    }

    setGeneratedCode(code);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Backend Integration
    // const response = await fetch('/api/iac/create', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ formData, generatedCode }),
    // });
    
    console.log('Generated IaC:', { formData, generatedCode });
    alert('IaC file saved! (Backend integration needed)');
  };

  const downloadYAML = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedCode], { type: 'text/yaml' });
    element.href = URL.createObjectURL(file);
    element.download = 'terraform-config.tf';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header showUserMenu={true} />

      {/* Main Content - Split View */}
      <main className="flex h-[calc(100vh-80px)]">
        {/* Left Side - Code Editor */}
        <div className="w-1/2 border-r border-slate-200 bg-slate-900 p-6 overflow-auto flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white text-lg font-semibold">Generated Code</h2>
            <button
              onClick={() => router.back()}
              className="text-slate-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          <pre className="text-slate-300 text-sm font-mono bg-slate-800 p-4 rounded-lg overflow-x-auto flex-1">
            <code>{generatedCode}</code>
          </pre>
          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigator.clipboard.writeText(generatedCode)}
              className="flex-1"
            >
              Copy Code
            </Button>
            <Button
              variant="outline"
              onClick={downloadYAML}
              className="flex-1"
            >
              ⬇ Download
            </Button>
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              ← Back
            </Button>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-1/2 bg-white p-6 overflow-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Create IaC File</h2>
            <button
              onClick={() => router.back()}
              className="text-slate-400 hover:text-slate-600 transition-colors text-2xl"
            >
              ✕
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Field Selection */}
            <div>
              <Label className="text-base font-semibold mb-4 block">
                Select Configuration Fields
              </Label>
              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                {fields.map(field => (
                  <div key={field.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={field.key}
                      checked={selectedFields.includes(field.key)}
                      onCheckedChange={() => handleFieldToggle(field.key)}
                    />
                    <label
                      htmlFor={field.key}
                      className="text-sm font-medium cursor-pointer text-slate-700"
                    >
                      {field.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Form Fields */}
            <div className="space-y-4">
              {fields.map(field => (
                selectedFields.includes(field.key) && (
                  <div key={field.key}>
                    <Label htmlFor={field.key}>{field.label}</Label>
                    {field.key === 'module' || field.key === 'provisioner' ? (
                      <Textarea
                        id={field.key}
                        name={field.key}
                        placeholder={`Enter ${field.label} configuration`}
                        value={formData[field.key]}
                        onChange={handleChange}
                        rows={3}
                      />
                    ) : (
                      <Input
                        id={field.key}
                        name={field.key}
                        type="text"
                        placeholder={`Enter ${field.label}`}
                        value={formData[field.key]}
                        onChange={handleChange}
                      />
                    )}
                  </div>
                )
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                Save Configuration
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setFormData({
                    provider: '',
                    resource: '',
                    variable: '',
                    output: '',
                    module: '',
                    state: '',
                    locals: '',
                    backend: '',
                    variableType: '',
                    dynamic: '',
                    forEach: '',
                    terraform: '',
                    tags: '',
                    lifecycle: '',
                    provisioner: '',
                  });
                  setGeneratedCode(`# Generated IaC Configuration\n# Your configuration will appear here\n`);
                }}
              >
                Clear
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
