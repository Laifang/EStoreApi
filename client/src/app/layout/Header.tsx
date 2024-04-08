import { AppBar, Switch, Toolbar, Typography } from "@mui/material";


interface Props {
    darkMode: boolean;
    handleThemeChange: () => void;
}


export default function Header({darkMode, handleThemeChange}: Props) {


    return (
        <>
            {/* sticky 属性的作用是 使 AppBar 始终在顶部显示 */}
            <AppBar position="sticky" sx={{ mb: 4 }}>
                <Toolbar>
                    <Typography variant="h6" >
                        电子商城
                    </Typography>
                    <Switch checked={darkMode} onChange={handleThemeChange} />
                </Toolbar>
            </AppBar>
        </>
    )
}