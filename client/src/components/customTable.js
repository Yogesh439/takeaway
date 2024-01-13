import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Table } from "antd";
import "../App.css";
import { useSelector } from "react-redux";
import CustomForm from "../components/customForm";
import { message, Popconfirm } from 'antd';
import io from 'socket.io-client';
const socket = io(process.env.REACT_APP_API_URL);

const CustomTable = () => {
  const { role, _id, token } = useSelector(state => state.user)
  const [orders, setOrders] = useState([])

  useEffect(() => {
    async function fetchData() {
      try {
        await socket.on('orderRequest', (orderRequest) => {
          const bckUpOrderList = [...orders];
          bckUpOrderList.map((item) => {
            if (item._id === orderRequest.id) {
              item.orderStatus = orderRequest.status;
            }
            return item;
          });
          setOrders(bckUpOrderList);
        });
      } catch (error) {
        console.error("Error in socket connection:", error);
      }
    }

    fetchData();

    // Cleanup function (if needed)
    return () => {
      // Cleanup code here
    };

    // Dependencies array, make sure to include any dependencies needed for this effect
  }, [orders]);

  const triggerDelete = async (id) => {
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: id }),
    };
    const res = await fetch(`${process.env.REACT_APP_API_URL}/orders`, requestOptions);
    if (res.status === 200) {
      fetchAvailableItems()
      message.success("Orders deleted successfully", [2])
    }
  }

  const itemDetails = [
    'sn',
    'productName',
    'pickupDate',
    'pickupTime',
    'weight',
    'unitItems',
    'maxLength'
  ]
  const senderDetails = [
    'receiverName',
    'receiverPhoneNo'
  ]
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const setIdAndShowModal = (item) => {
    showModal()
  }

  const columns = [
    {
      title: 'Product Name',
      dataIndex: 'productName',
    },
    {
      title: 'Pickup Date',
      dataIndex: 'pickupDate',
    },
    {
      title: 'Pickup Time',
      dataIndex: 'pickupTime',
    },
    {
      title: 'Reciver Name',
      dataIndex: "receiverName"
    },
    {
      title: 'Phone Number',
      dataIndex: "receiverPhoneNo",
    },
    {
      title: 'Unit Items',
      dataIndex: 'unitItems',
    },
    {
      title: 'Order Status',
      dataIndex: 'orderStatus',
    },
    {
      title: 'Weight',
      dataIndex: 'weight',
    },
    {
      title: 'Actions',
      key: 'key',
      dataIndex: 'key',
      render: (_, item) => (
        <>
          <Button onClick={() => setIdAndShowModal(item)}>
            {role === 'admin' ? 'Accept' : 'Edit'}
          </Button>
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => triggerDelete(item._id)}
          >
            <Button>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ]

  const fetchAvailableItems = () => {
    const requestOptions = {
      headers: {
        'authorization': `Bearer ${token}`
      }
    }
    axios.get(`${process.env.REACT_APP_API_URL}/orders?senderId=${_id}`, requestOptions).then((response) => {
      setOrders(response.data.orders)
    });
  }

  useEffect(() => {
    fetchAvailableItems()
  }, [])

  return (
    <>
      <Modal
        title="Edit Items"
        footer={null}
        visible={isModalOpen}
        onCancel={handleCancel}
      >
        <CustomForm itemDetails={itemDetails} senderDetails={senderDetails} />
      </Modal>

      <div className="customTable-box" >
        <h3>Order List</h3>
        <div className="table">
          <Table dataSource={orders} columns={columns} />
        </div>
      </div>
    </>
  );
};

export default CustomTable;
