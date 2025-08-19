import React from 'react';
import Link from 'next/link';

const RefForwardingLink = React.forwardRef<HTMLAnchorElement, React.ComponentPropsWithoutRef<typeof Link>>(
  ({ href, children, ...rest }, ref) => (
    <Link href={href} {...rest} ref={ref}>
      {children}
    </Link>
  )
);

RefForwardingLink.displayName = 'RefForwardingLink';

export default RefForwardingLink;