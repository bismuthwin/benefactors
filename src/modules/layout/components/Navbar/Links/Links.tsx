"use client";

import React, { type JSX } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Divider, Flex, NavLink } from "@mantine/core";
import { IconChartBarPopular, IconHome, IconServer2 } from "@tabler/icons-react";
import { Routes } from "~/constants/routes";

import style from "./Links.module.scss";

interface Link {
    icon: JSX.Element;
    label: string;
    href: string;
}

// Links that probably every user should see, e.g. dashboard
export const links = (iconSize = 24): Link[] => [
    {
        icon: <IconHome size={iconSize} />,
        label: "Home",
        href: Routes.HOME,
    },
    {
        icon: <IconServer2 size={iconSize} />,
        label: "Objects",
        href: Routes.OBJECTS,
    },
    {
        icon: <IconChartBarPopular size={iconSize} />,
        label: "Leaderboard",
        href: Routes.LEADERBOARD,
    },
];

/**
 * Renders links for sidebar
 */
export function Links() {
    const pathname = usePathname();

    return (
        <>
            <Flex direction={"row"} gap={"xs"}>
                {links().map((link, index) => (
                    <Flex key={index} gap={"xs"}>
                        <NavLink
                            className={style.link}
                            href={link.href}
                            leftSection={link.icon}
                            variant={"subtle"}
                            label={link.label}
                            active={
                                pathname === link.href || (link.href !== Routes.HOME && pathname?.startsWith(link.href))
                            }
                            component={Link}
                        />
                        {index < links().length - 1 && <Divider orientation="vertical" />}
                    </Flex>
                ))}
            </Flex>
        </>
    );
}
