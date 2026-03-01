"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";

interface Document {
  id: string;
  title: string;
  user_id: string;
  hidden: boolean;
  thread_id: string;
  created_at: Date;
}

export const DocumentContext = createContext<{
  documentData: Document[];
  refreshDocumentData: () => void;
}>({
  documentData: [],
  refreshDocumentData: () => {},
});

export const DocumentProvider = ({ children }) => {
  const [documentData, setDocumentData] = useState([]);
  const supabase = createSupabaseBrowserClient();

  const fetchDocumentData = async () => {
    const session = await supabase.auth.getSession();

    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", session.data.session?.user.id)
      .eq("hidden", false);

    if (data) {
      setDocumentData(data);
    }
  };

  useEffect(() => {
    fetchDocumentData();
  }, []);

  const refreshDocumentData = () => {
    fetchDocumentData();
  };

  return (
    <DocumentContext.Provider value={{ documentData, refreshDocumentData }}>
      {children}
    </DocumentContext.Provider>
  );
};
