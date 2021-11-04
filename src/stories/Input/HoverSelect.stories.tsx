import HoverSelect from 'components/Select/HoverSelect'

export default {
  title: 'Input/HoverSelect',
  component: HoverSelect
}

export const Default = () => (
  <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
    <HoverSelect
      selectedDisplay={1111}
      list={[111, 222, 333, 444]}
      onClickGenerator={item => {
        return () => {
          console.log(item)
        }
      }}
    />
  </div>
)
