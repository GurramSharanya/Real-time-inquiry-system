import { useEffect } from "react";
import { useInquiryStore } from "../store/inquiryStore";

const InquiryLoader = () => {
  const { fetchInquiries } = useInquiryStore();

  useEffect(() => {
    fetchInquiries(); // ✅ Fetch inquiries when the component mounts
  }, []);

  return null; // This component does not render anything
};

export default InquiryLoader;
