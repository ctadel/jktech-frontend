export interface PublicDocument {
  id: number;
  document_key: string;
  title: string;
  version: number;
  uploaded_at: string;
  user_id: number;
  stars: number;
  views: number;
  is_private_document: boolean;
}

export interface UserDocument extends PublicDocument {
  file_path: string;
  ingestion_status: string;
}

export interface UserDocumentStats {
  user_id: number;
  total_documents: number;
  total_views: number;
  total_stars: number;
  total_revisions: number;
  private_documents: number;
}
