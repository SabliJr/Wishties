import UserProfile from "../Container/Profile/index";

import Skeleton from "../utils/Skeleton";
import Loader from "../utils/Loader";

import { useCreatorData } from "../Context/CreatorDataProvider";
import { iCreatorDataProvider } from "../Types/creatorStuffTypes";

const WishList = () => {
  let { refreshCreatorData } = useCreatorData() as iCreatorDataProvider;

  return (
    <>
      {refreshCreatorData ? (
        <Loader />
      ) : (
        !refreshCreatorData && (
          <Skeleton>
            <UserProfile />
          </Skeleton>
        )
      )}
    </>
  );
};

export default WishList;
