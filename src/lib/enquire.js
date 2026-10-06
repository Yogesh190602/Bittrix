import { useNavigate } from "react-router-dom";

/* One enquiry path for the whole site: every "talk to us" action lands on
   /contact with the interest preselected, so the intent survives a page
   load, a shared link and a browser back button. */
export function useEnquire() {
  const navigate = useNavigate();

  return function enquire(interest) {
    navigate(`/contact?interest=${encodeURIComponent(interest)}`, {
      state: { focusForm: true },
    });
  };
}
