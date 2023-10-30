import { useEffect } from "react";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { useModal } from "@/app/_providers/modal/provider";
import LoginModal from "../Login";
import currentUserStore from "@/lib/stores/currentUser";
export default function useAuthGuard() {
  const modal = useModal();
  const { currentUser } = useCurrentUser();
  useEffect(() => {
    if (!currentUser) {
      modal?.swap(<LoginModal />);
    }
  }, [currentUserStore]);
}
