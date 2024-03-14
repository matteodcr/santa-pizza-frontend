import { ActionIcon, Anchor, Group, rem } from '@mantine/core';
import { IconBrandGithub, IconPizza } from '@tabler/icons-react';
import classes from './Footer.module.css';

const links = [
  { link: '#', label: 'About' },
  { link: '#', label: 'Contact' },
  { link: '#', label: 'Privacy' },
];

export function Footer() {
  const items = links.map((link) => (
    <Anchor
      c="dimmed"
      key={link.label}
      href={link.link}
      lh={1}
      onClick={(event) => event.preventDefault()}
      size="sm"
    >
      {link.label}
    </Anchor>
  ));

  return (
    <div className={classes.inner}>
      <IconPizza size={28} color="lightgrey" />

      <Group className={classes.links}>{items}</Group>

      <Group gap="xs" justify="flex-end" wrap="nowrap">
        <ActionIcon size="lg" variant="filled" color="black" radius="xl">
          <IconBrandGithub style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
        </ActionIcon>
      </Group>
    </div>
  );
}
