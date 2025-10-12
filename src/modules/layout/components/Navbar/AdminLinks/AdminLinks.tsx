"use client";

import React, { type JSX } from "react";
import type AdminLink from "next/link";
import Link from "next/link";
import { ActionIcon, Menu } from "@mantine/core";
import { IconLayoutDashboard, IconServerCog, IconSpiral, IconUsersGroup } from "@tabler/icons-react";
import { Routes } from "~/constants/routes";
import { Authorized, CreateChipModalMenuItem } from "~/modules";

import { CreateObjectModalMenuItem } from "../../../../app/components/CreateObjectModalMenuItem";
import style from "../Links/Links.module.scss";

interface AdminLink {
    icon: JSX.Element;
    label: string;
    href: string;
}

export const adminLinks = (iconSize = 24): AdminLink[] => [
    {
        icon: <IconLayoutDashboard size={iconSize} />,
        label: "Dashboard",
        href: Routes.ADMIN_DASHBOARD,
    },
    {
        icon: <IconUsersGroup size={iconSize} />,
        label: "Users",
        href: Routes.ADMIN_USERS,
    },
    {
        icon: <IconServerCog size={iconSize} />,
        label: "Object Management",
        href: Routes.ADMIN_OBJECTS,
    },
];

/**
 * Renders admin links for sidebar
 */
export function AdminLinks() {
    return (
        <>
            <Authorized role={"Admin"}>
                <Menu shadow="md" width={200}>
                    <Menu.Target>
                        <ActionIcon variant="transparent">
                            <IconSpiral size={24} />
                        </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Label>Admin Menu</Menu.Label>
                        {adminLinks().map((link, index) => (
                            <Menu.Item
                                key={index}
                                className={style.link}
                                href={link.href}
                                leftSection={link.icon}
                                variant={"subtle"}
                                component={Link}
                            >
                                {link.label}
                            </Menu.Item>
                        ))}
                        <CreateObjectModalMenuItem />
                        <CreateChipModalMenuItem />
                    </Menu.Dropdown>
                </Menu>
            </Authorized>
        </>
    );
}
