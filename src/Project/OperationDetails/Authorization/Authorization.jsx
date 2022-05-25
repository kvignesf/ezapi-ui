import "./styles.css";
import Dropdown from "react-multilevel-dropdown";

export default function Authorization() {
  const menus = [
    {
      name: "Movies",
      type: "page",
      id: "1",
      children: [
        {
          name: "Hindi Movies",
          type: "page",
          id: "one-one",
          children: [
            {
              name: "Action Movies",
              type: "page",
              id: "one-one-one",
            },
            {
              name: "Romantic Movies",
              type: "page",
              id: "one-one-two",
            },
          ],
        },
        {
          name: "Telugu Movies",
          type: "page",
          id: "one-two",
          children: [
            {
              name: "Actionvhnjhnb Movies",
              type: "page",
              id: "one-two-one",
            },
          ],
        },
      ],
    },
  ];

  return (
    <div className='App'>
      {menus.map((menu) => (
        <Dropdown
          title={menu.name}
          menuClassName='text-14 py-8 px-5 my-0 mx-16 border-b-1 border-solid border-blue hover:border-black'
        >
          {menu.children &&
            menu.children.map((item) => (
              <Dropdown.Item>
                {item.name}
                {item.children &&
                  item.children.map((submenu) => (
                    <Dropdown.Submenu position='right'>
                      <Dropdown.Item>{submenu.name}</Dropdown.Item>
                      {console.log(submenu.name)}
                      {/* {item.children &&
                        item.children.map((submenu) => (
                          <Dropdown.Submenu position="right">
                            <Dropdown.Item>{submenu.name}</Dropdown.Item>
                          </Dropdown.Submenu>
                        ))} */}
                    </Dropdown.Submenu>
                  ))}
              </Dropdown.Item>
            ))}
        </Dropdown>
      ))}
    </div>
  );
}
