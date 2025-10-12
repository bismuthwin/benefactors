import { Badge, Card, Flex, Text } from "@mantine/core";
import type { User } from "@prisma/client";
import { useRoleColor } from "~/modules/system";

import styles from "../CurrentUser/CurrentUser.module.scss";
import { PunchableAvatar } from "../PunchableAvatar";

interface UserListItemOptions {
    user: User;
}

export default function UserListItem({ user }: UserListItemOptions) {
    const roleColor = useRoleColor({ role: user?.role });

    return (
        <Card w={"100%"}>
            <Flex align={"center"} justify={"space-between"} w={"100%"}>
                <Flex w={"100%"} align={"center"} gap={"sm"}>
                    <PunchableAvatar soundUrl={"/sfx/punch.mp3"} scalar={2} src={user?.image ?? ""} />
                    <Flex direction={"column"}>
                        <Text fw={"600"}>{user?.name}</Text>
                        <Badge className={styles.roleBadge} size="xs" color={roleColor}>
                            {user?.role}
                        </Badge>
                    </Flex>
                </Flex>
                <Flex direction={"column"} gap={"sm"} align={"end"}>
                    <Text size="sm">{user?.id}</Text>
                </Flex>
            </Flex>
        </Card>
    );
}
