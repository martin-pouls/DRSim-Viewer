import {Card} from "@mantine/core";
import {ReactNode} from "react";

type DefaultCardProps = {
    children?: ReactNode;
};

export default function DefaultCard(props: DefaultCardProps) {
    return (
        <Card shadow="sm" p="xs" radius="md" withBorder>
            {props.children}
        </Card>
    )
}