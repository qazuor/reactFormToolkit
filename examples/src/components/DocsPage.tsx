import { DocsViewer } from './DocsViewer';

export default function DocsPage() {
    return (
        <div className='flex'>
            <div className='flex-1 overflow-auto'>
                <DocsViewer />
            </div>
        </div>
    );
}
