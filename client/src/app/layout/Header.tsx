import { ShoppingCart } from '@mui/icons-material';
import { AppBar, Badge, Box, IconButton, List, ListItem, Switch, Toolbar, Typography } from "@mui/material";
import { Link, NavLink } from 'react-router-dom';
import { useAppSelector } from '../store/configureStore';

const midLinks = [
    { title: '商品列表', path: '/catalog' },
    { title: '关于我们', path: '/about' },
    { title: '联系方式', path: '/contact' }
]

const rightLinks = [
    { title: '登录', path: '/login' },
    { title: '注册', path: '/register' },
]

const navLinkStyles = {
    color: 'inherit',
    textDecoration: 'none',
    typography: 'h6',
    '&:hover': {
        color: 'grey.500'
    },
    '&.active': {
        color: 'text.secondary'
    }
}

interface Props {
    darkMode: boolean;
    handleThemeChange: () => void;
}

export default function Header({ handleThemeChange, darkMode }: Props) {
    const { shoppingCart } = useAppSelector(state => state.shoppingCart);
    const itemsCount = shoppingCart?.items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        // sticky 属性使得 AppBar 始终保持在页面顶部
        <AppBar position='sticky' sx={{ mb: 4 }}>  
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box display='flex' alignItems='center'>
                    <Typography
                        variant='h6'
                        component={NavLink}
                        to='/'
                        sx={navLinkStyles}
                    >
                        📺电子商城
                    </Typography>
                    <Switch checked={darkMode} onChange={handleThemeChange} />
                </Box>

                <List sx={{ display: 'flex' }}>
                    {midLinks.map(({ title, path }) => (
                        <ListItem
                            component={NavLink}
                            to={path}
                            key={path}
                            sx={navLinkStyles}
                        >
                            {title.toUpperCase()}
                        </ListItem>
                    ))}
                </List>

                <Box display='flex' alignItems='center'>
                    <IconButton component={Link} to='shopingcart' size='large' edge='start' color='inherit' sx={{ mr: 2 }}>
                        <Badge badgeContent={itemsCount} color='secondary'>
                            <ShoppingCart />
                        </Badge>
                    </IconButton>
                    <List sx={{ display: 'flex' }}>
                        {rightLinks.map(({ title, path }) => (
                            <ListItem
                                component={NavLink}
                                to={path}
                                key={path}
                                sx={navLinkStyles}
                            >
                                {title.toUpperCase()}
                            </ListItem>
                        ))}
                    </List>
                </Box>

            </Toolbar>
        </AppBar>
    )
}