import { TableContainer, Table, TableBody, TableRow, TableCell, Card } from '@mui/material';
import { useAppSelector } from '../../store/configureStore';

export default function ShoppingCartSummary () {
    
    const { shoppingCart } = useAppSelector((state) => state.shoppingCart);
    const subtotal = shoppingCart?.items.reduce((sum, item) => sum + (item.quantity * item.price), 0) ?? 0;
    const deliveryFee = subtotal > 10000 ? 0 : 500;

    return (
        <>
            <TableContainer component={Card} variant={'outlined'}>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={2}>总金额</TableCell>
                            <TableCell align="right">{currencyFormat(subtotal)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>运费<span style={{fontStyle: 'italic', fontSize: '0.8rem', color: 'gray'}} >(满$100免运费)</span></TableCell>
                            <TableCell align="right">{currencyFormat(deliveryFee)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>最终金额</TableCell>
                            <TableCell align="right">{currencyFormat(subtotal + deliveryFee)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

function currencyFormat(amount: number) {
    return '$' + (amount/100).toFixed(2);
}