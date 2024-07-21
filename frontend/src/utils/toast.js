import { toast } from 'react-hot-toast';

export function showToastMessage(classification) {
    if (classification === 'violent') {
        toast.error('Violent content detected!', {
            duration: 5000,
            // position: 'top-right',
            // style: {
            //     border: '1px solid #ff0000',
            //     padding: '16px',
            //     color: '#ff0000',
            // },
            // iconTheme: {
            //     primary: '#ff0000',
            //     secondary: '#FFFAEE',
            // },
        });
    } else if (classification === 'non-violent') {
        toast.success('Non-violent content detected.', {
            duration: 5000,
            // position: 'center',
            // style: {
            //     border: '1px solid #00ff00',
            //     padding: '16px',
            //     color: '#00ff00',
            // },
            // iconTheme: {
            //     primary: '#00ff00',
            //     secondary: '#FFFAEE',
            // },
        });
    }
}