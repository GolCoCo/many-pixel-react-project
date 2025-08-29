import { Box } from "@components/Box";
import { Skeleton } from "@components/Skeleton";

export default function RowItemRequestSkeleton({isLastRequest}) {
    return (
        <Box $d="flex" $w="100%" $borderBottom={!isLastRequest ? '1px solid #D5D6DD' : 'none'}>
            <Skeleton $w="25" $h="20" $variant="priority" />
            <Box $pr="20" $pt="25">
                <Skeleton $w="22" $h="24" />
            </Box>
            <Box $d="flex" $flexDir="column" $gap="8px" $py="12px" $px="16px" $w="100%">
                <Skeleton $w="80" $h="20" />
                <Skeleton $w="100%" $h="40" />
            </Box>
            <Box $d="flex" $flexDir="column" $gap="8px" $py="12px" $px="16px" $w="140px" $mr="32px" $justifyContent="center">
                <Skeleton $w="80" $h="40" />
            </Box>
            <Box $d="flex" $flexDir="column" $gap="8px" $py="12px" $px="16px" $justifyContent="center" $mr="54px" $w="110px">
                <Skeleton $w="24" $h="24" />
                <Skeleton $w="50" $h="20" />
            </Box>
            <Box $d="flex" $flexDir="column" $gap="8px" $py="12px" $px="16px" $justifyContent="center" $w="140px">
                <Skeleton $w="24" $h="24" />
                <Skeleton $w="108" $h="20" />
            </Box>
            <Box $d="flex" $flexDir="column" $gap="8px" $py="12px" $px="16px" $justifyContent="center" $w="120px">
                <Skeleton $w="80" $h="20" />
            </Box>
            <Box $d="flex" $flexDir="column" $gap="8px" $py="12px" $px="16px" $justifyContent="center" $mr="32px" $w="140px">
                <Skeleton $w="80" $h="20" />
            </Box>
            <Box $d="flex" $flexDir="column" $gap="8px" $py="12px" $px="16px" $justifyContent="center" $mr="32px" $w="100px">
                <Skeleton $w="80" $h="20" />
            </Box>
            <Box $d="flex" $flexDir="column" $gap="8px" $py="12px" $px="16px" $justifyContent="center" $mr="16px" $w="72px">
                <Skeleton $w="40" $h="40" />
            </Box>
        </Box>
    );
}
