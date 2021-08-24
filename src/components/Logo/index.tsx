import React from 'react';

import { chakra, useTheme } from '@chakra-ui/react';

export const Logo = ({ colorScheme = 'brand', ...rest }) => {
  const theme = useTheme();
  const gradientId = `logo-brand-gradient-${colorScheme}`;
  return (
    <chakra.svg h="1.6rem" viewBox="0 0 519 116" {...rest}>
      <title>Start UI</title>
      <path
        d="M168.216 94.038c-6.337 0-11.773-.934-16.309-2.802-4.535-1.868-7.971-4.302-10.305-7.304-2.268-3.068-3.469-6.403-3.602-10.005 0-.534.2-1 .6-1.4.467-.468 1.001-.701 1.601-.701h12.607c.8 0 1.434.167 1.901.5.533.267 1.067.7 1.601 1.301.867 1.734 2.267 3.168 4.202 4.302 1.934 1.134 4.502 1.701 7.704 1.701 3.802 0 6.703-.6 8.704-1.8 2.001-1.201 3.002-2.836 3.002-4.903 0-1.468-.534-2.669-1.601-3.602-1-.934-2.601-1.768-4.802-2.502-2.202-.733-5.47-1.567-9.806-2.5-8.004-1.668-14.007-4.103-18.009-7.305-3.935-3.268-5.903-7.904-5.903-13.907 0-4.069 1.134-7.704 3.402-10.906 2.268-3.201 5.503-5.703 9.705-7.504 4.202-1.8 9.105-2.701 14.707-2.701 5.804 0 10.839 1 15.108 3.002 4.269 2 7.504 4.535 9.705 7.604 2.268 3.001 3.469 5.97 3.602 8.904 0 .6-.2 1.1-.6 1.501-.4.4-.9.6-1.501.6h-13.207c-.8 0-1.467-.133-2.001-.4-.467-.267-.9-.7-1.3-1.3-.401-1.535-1.501-2.835-3.302-3.903-1.734-1.067-3.902-1.6-6.504-1.6-3.001 0-5.302.533-6.903 1.6-1.601 1.068-2.401 2.635-2.401 4.703 0 1.4.433 2.568 1.3 3.502.934.934 2.402 1.8 4.403 2.601 2.067.734 5.002 1.5 8.804 2.301 6.203 1.134 11.139 2.568 14.808 4.302 3.735 1.668 6.47 3.87 8.204 6.604 1.734 2.668 2.602 6.036 2.602 10.105 0 4.47-1.301 8.371-3.902 11.706-2.535 3.269-6.104 5.803-10.706 7.604-4.536 1.734-9.738 2.602-15.608 2.602zM233.959 93.037c-13.807 0-20.711-6.57-20.711-19.71v-19.21h-7.804c-.734 0-1.368-.234-1.901-.7-.467-.468-.701-1.068-.701-1.802v-8.104c0-.733.234-1.334.701-1.8.533-.468 1.167-.701 1.901-.701h7.804V24.5c0-.733.233-1.334.7-1.8.534-.468 1.134-.701 1.801-.701h11.606c.734 0 1.334.233 1.801.7.467.467.701 1.068.701 1.801V41.01h12.506c.734 0 1.334.233 1.801.7.534.467.8 1.068.8 1.801v8.104c0 .734-.266 1.334-.8 1.801-.467.467-1.067.7-1.801.7h-12.506v17.81c0 4.936 1.901 7.404 5.703 7.404h7.704c.733 0 1.334.233 1.801.7.466.467.7 1.067.7 1.801v8.705c0 .667-.234 1.267-.7 1.8-.467.468-1.068.701-1.801.701h-9.305zM269.657 94.038c-3.535 0-6.77-.667-9.705-2.001-2.868-1.401-5.136-3.269-6.804-5.603-1.6-2.402-2.401-5.036-2.401-7.904 0-4.603 1.868-8.305 5.603-11.106 3.802-2.802 9.005-4.736 15.608-5.803l12.507-1.901v-1.401c0-2.535-.534-4.402-1.601-5.603-1.067-1.2-2.868-1.8-5.403-1.8-1.534 0-2.801.266-3.802.8-1 .533-2.034 1.267-3.101 2.2-.934.801-1.635 1.335-2.102 1.602-.2.533-.567.8-1.1.8H256.45c-.667 0-1.234-.2-1.701-.6-.4-.467-.567-1-.5-1.601.067-1.801.934-3.802 2.601-6.003 1.735-2.201 4.336-4.102 7.804-5.703 3.536-1.601 7.871-2.402 13.007-2.402 8.205 0 14.274 1.835 18.21 5.503 3.935 3.602 5.903 8.471 5.903 14.608v30.416c0 .667-.234 1.267-.701 1.8-.466.468-1.067.701-1.8.701h-11.607c-.667 0-1.267-.233-1.8-.7-.467-.534-.701-1.134-.701-1.801v-3.502c-1.467 2.068-3.535 3.769-6.203 5.103-2.601 1.267-5.703 1.9-9.305 1.9zm4.703-11.406c3.068 0 5.536-1 7.403-3.002 1.935-2 2.902-4.936 2.902-8.804v-1.401l-8.505 1.5c-6.003 1.068-9.004 3.169-9.004 6.304 0 1.667.7 3.001 2.101 4.002 1.401.934 3.101 1.4 5.103 1.4zM311.598 93.037c-.733 0-1.334-.233-1.8-.7-.467-.467-.701-1.068-.701-1.801V43.51c0-.733.234-1.334.701-1.8.466-.468 1.067-.701 1.8-.701h11.506c.734 0 1.335.267 1.801.8.534.467.801 1.034.801 1.701v4.002c3.668-4.335 8.604-6.503 14.808-6.503h4.402c.734 0 1.334.233 1.801.7.467.467.7 1.068.7 1.801v10.306c0 .667-.233 1.267-.7 1.8-.467.468-1.067.7-1.801.7h-9.705c-2.735 0-4.869.768-6.404 2.302-1.467 1.468-2.201 3.569-2.201 6.303v25.614c0 .733-.266 1.334-.8 1.8-.467.468-1.067.701-1.801.701h-12.407zM384.598 93.037c-13.807 0-20.71-6.57-20.71-19.71v-19.21h-7.804c-.734 0-1.368-.234-1.901-.7-.467-.468-.701-1.068-.701-1.802v-8.104c0-.733.234-1.334.701-1.8.533-.468 1.167-.701 1.901-.701h7.804V24.5c0-.733.233-1.334.7-1.8.534-.468 1.134-.701 1.801-.701h11.606c.734 0 1.334.233 1.801.7.467.467.7 1.068.7 1.801V41.01h12.507c.734 0 1.334.233 1.801.7.533.467.8 1.068.8 1.801v8.104c0 .734-.267 1.334-.8 1.801-.467.467-1.067.7-1.801.7h-12.507v17.81c0 4.936 1.901 7.404 5.703 7.404h7.704c.734 0 1.334.233 1.801.7.467.467.701 1.067.701 1.801v8.705c0 .667-.234 1.267-.701 1.8-.467.468-1.067.701-1.801.701h-9.305zM457.018 94.038c-9.405 0-16.775-2.302-22.111-6.904-5.27-4.602-7.904-11.54-7.904-20.81V25.501c0-.734.233-1.334.7-1.801.533-.467 1.134-.7 1.801-.7h12.907c.733 0 1.334.233 1.801.7.533.467.8 1.067.8 1.8v40.722c0 4.336 1 7.604 3.001 9.805 2.068 2.135 5.036 3.202 8.905 3.202 3.802 0 6.737-1.1 8.805-3.302 2.067-2.201 3.101-5.436 3.101-9.705V25.502c0-.734.234-1.334.701-1.801.533-.467 1.134-.7 1.801-.7h13.006c.734 0 1.335.233 1.801.7.467.467.701 1.067.701 1.8v40.822c0 9.272-2.668 16.209-8.004 20.811-5.27 4.602-12.54 6.904-21.812 6.904zM502.603 93.037c-.667 0-1.267-.233-1.801-.7-.467-.534-.7-1.134-.7-1.801V25.502c0-.734.233-1.334.7-1.801.534-.467 1.134-.7 1.801-.7h13.407c.734 0 1.334.233 1.801.7.534.467.8 1.067.8 1.8v65.035c0 .733-.266 1.334-.8 1.8-.467.468-1.067.701-1.801.701h-13.407z"
        fill="currentColor"
      />
      <path
        d="M50.759.876C42.9-.612 34.76-.243 27.172 2.275 15.234 6.239 1.328 16.339.13 41.79-2 87.04 22.21 110.828 56.801 115.664c26.148 3.656 43.782-23.474 50.828-36.922a46.24 46.24 0 005.367-22.205c-.298-17.597-9.522-45.683-62.237-55.66z"
        fill={`url(#${gradientId})`}
      />
      <path
        d="M78.243 34.89l-39.945-4.216c-7.435-.784-12.765 7.04-9.323 13.69a17.938 17.938 0 012.002 8.511c-.044 2.96-.213 5.326-2.256 8.452-2.042 3.127-7.98 10.275-7.98 10.275a1.907 1.907 0 00.586 2.497c.26.177.558.287.87.32 0 0 8.533-.466 12.112-.929 3.58-.462 6.197 1.451 8.825 3.248a19.265 19.265 0 016.234 7.049c3.45 6.652 12.897 6.78 16.535.222l19.544-35.21a9.431 9.431 0 00.127-8.9 9.354 9.354 0 00-7.331-5.01z"
        fill={theme.colors.gray['900']}
      />
      <defs>
        <linearGradient
          id={gradientId}
          x1={56.499}
          y1={0}
          x2={56.499}
          y2={116}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={theme.colors[colorScheme]?.['400']} />
          <stop offset={1} stopColor={theme.colors[colorScheme]?.['500']} />
        </linearGradient>
      </defs>
    </chakra.svg>
  );
};
