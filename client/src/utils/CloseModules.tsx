import React, { useCallback, useEffect } from "react";

const CloseModules = ({
  module_ref,
  ft_close_module,
}: {
  module_ref: React.MutableRefObject<HTMLDivElement | null>;
  ft_close_module: () => void;
}) => {
  // This function is to close the module of adding wish when the user clicks outside the module
  const closeModuleOutside = useCallback(
    (e: MouseEvent) => {
      if (
        module_ref?.current &&
        !module_ref?.current?.contains(e.target as Node)
      ) {
        ft_close_module();
      }
    },
    [ft_close_module]
  );

  useEffect(() => {
    document.addEventListener("mouseup", closeModuleOutside);
    return () => {
      document.removeEventListener("mouseup", closeModuleOutside);
    };
  }, [closeModuleOutside]);
};

export default CloseModules;
