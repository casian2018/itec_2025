import React, { useState } from 'react';
import { Modal, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const EventUpload: React.FC = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [fileList, setFileList] = useState<any[]>([]);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        if (fileList.length === 0) {
            message.warning('Please upload at least one file.');
            return;
        }
        message.success('Files uploaded successfully!');
        setIsModalVisible(false);
        setFileList([]);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setFileList([]);
    };

    const handleUploadChange = (info: any) => {
        let newFileList = [...info.fileList];
        newFileList = newFileList.slice(-5); // Limit to 5 files
        setFileList(newFileList);
    };

    return (
        <>
            <Button type="primary" onClick={showModal}>
                Upload Materials
            </Button>
            <Modal
                title="Upload Materials"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Upload"
                cancelText="Cancel"
            >
                <Upload
                    multiple
                    fileList={fileList}
                    onChange={handleUploadChange}
                    beforeUpload={() => false} // Prevent automatic upload
                >
                    <Button icon={<UploadOutlined />}>Select Files</Button>
                </Upload>
                <p style={{ marginTop: 10 }}>You can upload up to 5 files.</p>
            </Modal>
        </>
    );
};

export default EventUpload;