import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create(['width', 'background-color'], {
      duration: theme.transitions.duration.short,
    }),
    [theme.breakpoints.up('sm')]: {
      width: '20ch',
      '&:focus': {
        width: '24ch',
      },
    },
  },
}));

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <Search>
      <StyledInputBase
        placeholder="Search…"
        inputProps={{ 'aria-label': 'search' }}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </Search>
  );
};

export default SearchBar;