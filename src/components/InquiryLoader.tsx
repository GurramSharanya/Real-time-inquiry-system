import { useEffect } from "react";
import { useInquiryStore } from "../store/inquiryStore";

const InquiryLoader = () => {
  const { fetchInquiries } = useInquiryStore();

  useEffect(() => {
    fetchInquiries(); 
  }, []);

  return null; 
};

export default InquiryLoader;
