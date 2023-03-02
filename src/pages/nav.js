import * as React from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import PersonIcon from '@mui/icons-material/Person';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';

export default function Nav() {
  const [value, setValue] = React.useState(0);

  return (
    <Box sx={{ width: 500 }}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <Link href="/users"><BottomNavigationAction label="Users" icon={<PersonIcon />} /></Link>
        <Link href="/items"><BottomNavigationAction label="Items" icon={<TextSnippetIcon />} /></Link>
        
      </BottomNavigation>
    </Box>
  );
}