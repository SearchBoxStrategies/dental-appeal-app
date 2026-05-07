import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  Clock,
  Calendar,
  Building2,
  User,
  DollarSign,
  Activity,
  Download,
  Copy,
  Printer
} from 'lucide-react';
import api from '../lib/api';
import DocumentUpload from '../components/DocumentUpload';
