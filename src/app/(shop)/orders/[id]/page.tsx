import { getOrderById } from "@/actions";
import { OrderStatus, PayPalButton, Title } from "@/components";
import Image from "next/image";
import { currencyFormatter } from '../../../../utils/currencyFormatter';
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrdersByIdPage({ params }: Props) {
  const realParams = await params;
  const { id } = realParams;

  const {ok, order} = await getOrderById(id);

  if(!ok){
    redirect('/')
  }

  const address = order!.OrderAddress;
  const products = order!.OrderItem;

  
  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title={`Orden #${id.split('-').at(1)}`} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">

          {/* carrito */}
          <div className="flex flex-col mt-5">           
            
            <OrderStatus isPaid={order?.isPaid ?? false}/>

            {/* items */}
            {
              products.map(item => (
                <div key={item.product.slug + '-' + item.size} className="flex mb-5">
                  <Image
                    style={{
                      width: '100px',
                      height: '100px'
                    }}
                    src={`/products/${item.product.ProductImage[0].url}`}
                    width={100}
                    height={100}
                    alt={item.product.title}
                    className="mr-5 rounded"
                  />

                  <div>
                    <p>{item.product.title}</p>
                    <p>{item.price} x {item.quantity}</p>
                    <p className="font-bold">Subtotal: {currencyFormatter(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))
            }
          </div>


          {/* checkout resumen de orden*/}
          <div className="bg-white rounded-xl shadow-xl p-7">
            <h2 className="text-2xl mb-2">Dirección de entrega</h2>
            <div className="mb-10">
              <p className="text-xl">
                  {address!.firstName} {address!.lastName}
              </p>
              <p>{address!.address}</p>
              <p>{address!.address2}</p>
              <p>{address!.postalCode}</p>
              <p>{address!.city}, {address!.countryId}</p>
              <p>{address!.phone}</p>
            </div>

            <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

            <h2 className="text-2xl mb-2">Resumen de orden</h2>
            <div className="grid grid-cols-2">
              <span>No. Productos</span>
              <span className="text-right">{order!.itemsInOrder === 1 ? '1 artículo' : `${order!.itemsInOrder} artículos`}</span>

              <span>Subtotal</span>
              <span className="text-right">{currencyFormatter(order!.subTotal)}</span>

              <span>Impuestos (15%)</span>
              <span className="text-right">{currencyFormatter(order!.tax)}</span>

              <span className="mt-5 text-2xl">Total:</span>
              <span className="mt-5 text-right text-2xl">{currencyFormatter(order!.total)}</span>
            </div>

            <div className="mt-5 mb-2 w-full">
              {
                order?.isPaid
                ? (
                  <OrderStatus isPaid={order?.isPaid ?? false}/>
                )
                : (
                  <PayPalButton
                    amount={order!.total}
                    orderId={order!.id}
                  />
                )
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
