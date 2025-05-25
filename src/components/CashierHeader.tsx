
import { TiCancel } from "react-icons/ti";
import { TfiMoney } from "react-icons/tfi";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { useEffect, useState, useCallback, useMemo, memo } from "react";
import { logoutUser } from "../features/slices/userSlice";
import { clearBetData } from "../features/slices/betData";

interface CashierHeaderOptions {
  handleOpen: () => void;
  handleRedeemOpen: () => void;
  handleCancelRedeem: (val: string) => void;
}

// Separate clock component to prevent parent re-renders
const Clock = memo(() => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timerID = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => {
      clearInterval(timerID);
    };
  }, []);

  return (
    <p
      className="text-xs font-thin text-[10px]"
      style={{
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      }}
    >
      {date.toLocaleDateString()} {date.toLocaleTimeString()}
    </p>
  );
});

// Memoized button component to prevent unnecessary re-renders
const ActionButton = memo(({
  onClick,
  style,
  className,
  children
}: {
  onClick: () => void;
  style?: React.CSSProperties;
  className: string;
  children: React.ReactNode
}) => (
  <button
    style={style}
    onClick={onClick}
    className={className}
  >
    {children}
  </button>
));

// Main component with React.memo for optimization
function CashierHeader({
  handleOpen,
  handleRedeemOpen,
  handleCancelRedeem,
}: CashierHeaderOptions) {
  // More specific selector to prevent re-renders when other parts of state change
  const username = useAppSelector((state) => state.user.user?.username);
  const dispatch = useAppDispatch();

  // Memoize event handlers with useCallback
  const logout = useCallback(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  const openCancelRedeem = useCallback((val: string) => {
    handleCancelRedeem(val);
    handleRedeemOpen();
    dispatch(clearBetData());
  }, [handleCancelRedeem, handleRedeemOpen, dispatch]);

  // Memoize button styles to prevent recreation on each render
  const cancelButtonStyle = useMemo(() => ({ borderRadius: "3px" }), []);
  const cashierButtonStyle = useMemo(() => ({ backgroundColor: "#37B34A", borderRadius: "3px" }), []);
  const redeemButtonStyle = useMemo(() => ({ borderRadius: "3px", backgroundColor: "#5cb85c" }), []);
  const fontStyle = useMemo(() => ({
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'
  }), []);

  // Memoize the cancel button click handler
  const handleCancelClick = useCallback(() => {
    openCancelRedeem("cancel");
  }, [openCancelRedeem]);

  // Memoize the redeem button click handler
  const handleRedeemClick = useCallback(() => {
    openCancelRedeem("redeem");
  }, [openCancelRedeem]);

  return (
    <div className="header-container bg-gray-50/80 items-start w-full pl-4 pr-4 pb-2 flex flex-col md:flex-row sticky justify-between">
      <div className="text-xl font-thin font-sans pt-1 text-green-500 text-nowrap -mt-2 w-full md:w-auto text-center md:text-left">
        Retail Logo
      </div>
      <div className="flex flex-wrap md:flex-nowrap gap-2 justify-center w-full p-2 pb-0">
        <ActionButton
          style={cashierButtonStyle}
          onClick={handleOpen}
          className="p-2 min-w-24 md:min-w-28 hover:!bg-green-600/80 max-h-8 flex justify-center font-light items-center text-white rounded-sm text-sm md:text-base"
        >
          Cashier Options
        </ActionButton>
        <ActionButton
          onClick={handleCancelClick}
          style={cancelButtonStyle}
          className="my-cancel-btn min-w-24 md:min-w-28 max-h-8 hover:opacity-75 transition-all justify-center flex items-center gap-1 text-white rounded-sm text-sm md:text-base"
        >
          <span className="pl-2">Cancel</span>
          <TiCancel size={20} />
        </ActionButton>
        <ActionButton
          onClick={handleRedeemClick}
          style={redeemButtonStyle}
          className="min-w-24 md:min-w-28 max-h-12 flex justify-center hover:!bg-green-600/70 transition-all items-center gap-1 text-white rounded-sm text-sm md:text-base"
        >
          <span className="pl-2">Redeem</span>
          <TfiMoney
            size={15}
            className="font-bold"
            style={{ fontWeight: 400 }}
          />
        </ActionButton>
      </div>
      <div className="flex items-center md:items-end !text-gray-500 flex-col gap-0 justify-end w-full md:w-auto">
        <Clock />
        <div className="w-full md:w-80 mb-1 -mt-1 flex justify-center md:justify-end font-thin font-custom items-center">
          <p
            className="text-sm"
            style={fontStyle}
          >
            {username}
          </p>
          <p
            className="text-sm x"
            style={fontStyle}
          >
            ({username})
          </p>
          <a
            onClick={logout}
            className="ml-4 before:text-green-600 after:mt-1 before:content-['Logout'] w-[70px] before:text-center before:flex before:items-center before:justify-center text-sm before:absolute before:bg-gray-200 before:w-[70px] before:h-full before:top-0 before:right-0 before:z-0 before:bg-transparent z-10 before:transition-opacity hover:before:bg-gray-200 before:duration-300 before:ease-in-out rounded-md cursor-pointer"
            href="#"
            style={fontStyle}
          ></a>
        </div>
      </div>
    </div>
  );
}

// Export memoized component to prevent unnecessary re-renders
export default memo(CashierHeader);
